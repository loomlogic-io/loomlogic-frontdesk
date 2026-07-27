import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { AppError, NotFoundError } from "@/lib/errors/app-error";
import type { Database, Tables } from "@/types/database.generated";

function queryError(operation: string, error: { code?: string; message: string }) {
  return new AppError("INTERNAL_ERROR", "The requested workspace data could not load.", {
    status: 500,
    cause: error,
    details: {
      operation,
      databaseCode: error.code ?? "unknown",
    },
  });
}

export type RecoveryCaseListItem = Tables<"recovery_cases"> & {
  contact: Pick<Tables<"contacts">, "id" | "display_name" | "is_demo">;
};

export type ConversationListItem = Tables<"conversations"> & {
  contact: Pick<Tables<"contacts">, "id" | "display_name" | "is_demo">;
  recoveryCase: Pick<
    Tables<"recovery_cases">,
    "id" | "reference" | "status" | "estimated_value_minor" | "currency_code"
  > | null;
};

export class RecoveryQueryRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async getOverview(organizationId: string) {
    const [casesResult, messagesResult, attributionsResult, activityResult] =
      await Promise.all([
        this.client
          .from("recovery_cases")
          .select("id, status, urgency, next_action_due_at")
          .eq("organization_id", organizationId),
        this.client
          .from("messages")
          .select("id", { count: "exact", head: true })
          .eq("organization_id", organizationId)
          .eq("provider", "mock")
          .eq("status", "sent"),
        this.client
          .from("revenue_attributions")
          .select("recovery_case_id, level, amount_minor, currency_code")
          .eq("organization_id", organizationId),
        this.client
          .from("recovery_case_events")
          .select("id, recovery_case_id, event_type, description, occurred_at")
          .eq("organization_id", organizationId)
          .order("occurred_at", { ascending: false })
          .limit(8),
      ]);

    for (const [operation, result] of [
      ["overview_cases", casesResult],
      ["overview_messages", messagesResult],
      ["overview_attributions", attributionsResult],
      ["overview_activity", activityResult],
    ] as const) {
      if (result.error) {
        throw queryError(operation, result.error);
      }
    }

    const cases = casesResult.data ?? [];
    const now = Date.now();
    const openStatuses = new Set([
      "new",
      "engaging",
      "qualified",
      "awaiting_customer",
      "awaiting_staff",
      "booking_offered",
      "escalated",
    ]);
    const currentAttributions = new Map<
      string,
      { level: string; amount_minor: number; currency_code: string }
    >();
    const attributionRank: Record<string, number> = {
      estimated: 1,
      confirmed: 2,
      verified: 3,
    };

    for (const attribution of attributionsResult.data ?? []) {
      const current = currentAttributions.get(attribution.recovery_case_id);
      if (
        !current ||
        attributionRank[attribution.level]! > attributionRank[current.level]!
      ) {
        currentAttributions.set(attribution.recovery_case_id, attribution);
      }
    }

    const currencyTotals = new Map<string, number>();
    for (const attribution of currentAttributions.values()) {
      currencyTotals.set(
        attribution.currency_code,
        (currencyTotals.get(attribution.currency_code) ?? 0) + attribution.amount_minor,
      );
    }

    return {
      openCases: cases.filter((item) => openStatuses.has(item.status)).length,
      requiringAttention: cases.filter(
        (item) =>
          openStatuses.has(item.status) &&
          (item.urgency === "high" ||
            (item.next_action_due_at &&
              new Date(item.next_action_due_at).getTime() < now)),
      ).length,
      mockFollowUpsSent: messagesResult.count ?? 0,
      bookedOutcomes: cases.filter((item) =>
        ["booked", "recovered", "closed"].includes(item.status),
      ).length,
      recoveredValue: [...currencyTotals.entries()].map(
        ([currencyCode, amountMinor]) => ({ currencyCode, amountMinor }),
      ),
      activity: activityResult.data ?? [],
    };
  }

  async listRecoveryCases(input: {
    organizationId: string;
    page: number;
    pageSize: number;
    status?: string;
    query?: string;
  }) {
    const from = (input.page - 1) * input.pageSize;
    const to = from + input.pageSize - 1;
    let query = this.client
      .from("recovery_cases")
      .select("*, contact:contacts!inner(id, display_name, is_demo)", { count: "exact" })
      .eq("organization_id", input.organizationId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (input.status && input.status !== "all") {
      query = query.eq("status", input.status);
    }
    if (input.query) {
      const safeQuery = input.query.replaceAll(/[,%()]/g, " ").trim();
      if (safeQuery) {
        const { data: matchingContacts, error: contactSearchError } = await this.client
          .from("contacts")
          .select("id")
          .eq("organization_id", input.organizationId)
          .ilike("display_name", `%${safeQuery}%`)
          .limit(100);
        if (contactSearchError) {
          throw queryError("search_recovery_contacts", contactSearchError);
        }
        const contactFilters = (matchingContacts ?? []).map(
          (contact) => `contact_id.eq.${contact.id}`,
        );
        query = query.or(
          [
            `reference.ilike.%${safeQuery}%`,
            `reason.ilike.%${safeQuery}%`,
            ...contactFilters,
          ].join(","),
        );
      }
    }

    const { data, error, count } = await query;
    if (error) {
      throw queryError("list_recovery_cases", error);
    }

    return {
      items: (data ?? []) as RecoveryCaseListItem[],
      total: count ?? 0,
      page: input.page,
      pageSize: input.pageSize,
    };
  }

  async getRecoveryCaseDetail(organizationId: string, recoveryCaseId: string) {
    const { data: recoveryCase, error: caseError } = await this.client
      .from("recovery_cases")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("id", recoveryCaseId)
      .maybeSingle();

    if (caseError) {
      throw queryError("get_recovery_case_detail", caseError);
    }
    if (!recoveryCase) {
      throw new NotFoundError("Recovery Case not found.");
    }

    const [
      contactResult,
      channelsResult,
      conversationResult,
      callsResult,
      eventsResult,
      tasksResult,
      messagesResult,
      approvalsResult,
      attributionsResult,
    ] = await Promise.all([
      this.client
        .from("contacts")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("id", recoveryCase.contact_id)
        .single(),
      this.client
        .from("contact_channels")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("contact_id", recoveryCase.contact_id)
        .order("is_primary", { ascending: false }),
      this.client
        .from("conversations")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("id", recoveryCase.conversation_id)
        .single(),
      this.client
        .from("calls")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("conversation_id", recoveryCase.conversation_id)
        .order("started_at", { ascending: false }),
      this.client
        .from("recovery_case_events")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("recovery_case_id", recoveryCase.id)
        .order("occurred_at", { ascending: false }),
      this.client
        .from("tasks")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("recovery_case_id", recoveryCase.id)
        .order("created_at", { ascending: false }),
      this.client
        .from("messages")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("recovery_case_id", recoveryCase.id)
        .order("created_at", { ascending: false }),
      this.client
        .from("action_approvals")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("recovery_case_id", recoveryCase.id)
        .order("created_at", { ascending: false }),
      this.client
        .from("revenue_attributions")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("recovery_case_id", recoveryCase.id)
        .order("attributed_at", { ascending: false }),
    ]);

    for (const [operation, result] of [
      ["case_contact", contactResult],
      ["case_channels", channelsResult],
      ["case_conversation", conversationResult],
      ["case_calls", callsResult],
      ["case_events", eventsResult],
      ["case_tasks", tasksResult],
      ["case_messages", messagesResult],
      ["case_approvals", approvalsResult],
      ["case_attributions", attributionsResult],
    ] as const) {
      if (result.error) {
        throw queryError(operation, result.error);
      }
    }

    const auditTargetIds = [
      recoveryCase.id,
      ...(messagesResult.data ?? []).map((message) => message.id),
      ...(approvalsResult.data ?? []).map((approval) => approval.id),
    ];
    const auditsResult = await this.client
      .from("audit_logs")
      .select(
        "id, action, target_type, target_id, source, request_id, metadata, created_at",
      )
      .eq("organization_id", organizationId)
      .in("target_id", auditTargetIds)
      .order("created_at", { ascending: false });
    if (auditsResult.error) {
      throw queryError("case_audits", auditsResult.error);
    }

    return {
      recoveryCase,
      contact: contactResult.data,
      channels: channelsResult.data ?? [],
      conversation: conversationResult.data,
      calls: callsResult.data ?? [],
      events: eventsResult.data ?? [],
      tasks: tasksResult.data ?? [],
      messages: messagesResult.data ?? [],
      approvals: approvalsResult.data ?? [],
      attributions: attributionsResult.data ?? [],
      audits: auditsResult.data ?? [],
    };
  }

  async listContacts(input: {
    organizationId: string;
    page: number;
    pageSize: number;
    query?: string;
  }) {
    const from = (input.page - 1) * input.pageSize;
    const to = from + input.pageSize - 1;
    let query = this.client
      .from("contacts")
      .select(
        "*, contact_channels(id, type, display_value, is_primary, is_verified, consent_status)",
        {
          count: "exact",
        },
      )
      .eq("organization_id", input.organizationId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (input.query) {
      const safeQuery = input.query.replaceAll(/[,%()]/g, " ").trim();
      if (safeQuery) {
        query = query.ilike("display_name", `%${safeQuery}%`);
      }
    }

    const { data, error, count } = await query;
    if (error) {
      throw queryError("list_contacts", error);
    }
    return { items: data ?? [], total: count ?? 0 };
  }

  async getContactDetail(organizationId: string, contactId: string) {
    const { data: contact, error } = await this.client
      .from("contacts")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("id", contactId)
      .maybeSingle();
    if (error) {
      throw queryError("get_contact_detail", error);
    }
    if (!contact) {
      throw new NotFoundError("Contact not found.");
    }

    const [channels, cases, conversations] = await Promise.all([
      this.client
        .from("contact_channels")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("contact_id", contactId)
        .order("is_primary", { ascending: false }),
      this.client
        .from("recovery_cases")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("contact_id", contactId)
        .order("created_at", { ascending: false }),
      this.client
        .from("conversations")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("contact_id", contactId)
        .order("last_activity_at", { ascending: false }),
    ]);
    if (channels.error) throw queryError("contact_channels", channels.error);
    if (cases.error) throw queryError("contact_cases", cases.error);
    if (conversations.error)
      throw queryError("contact_conversations", conversations.error);

    return {
      contact,
      channels: channels.data ?? [],
      cases: cases.data ?? [],
      conversations: conversations.data ?? [],
    };
  }

  async listConversations(input: {
    organizationId: string;
    page: number;
    pageSize: number;
    status?: string;
  }) {
    const from = (input.page - 1) * input.pageSize;
    const to = from + input.pageSize - 1;
    let query = this.client
      .from("conversations")
      .select("*, contact:contacts!inner(id, display_name, is_demo)", { count: "exact" })
      .eq("organization_id", input.organizationId)
      .order("last_activity_at", { ascending: false })
      .range(from, to);

    if (input.status && input.status !== "all") {
      query = query.eq("status", input.status);
    }
    const { data, error, count } = await query;
    if (error) {
      throw queryError("list_conversations", error);
    }

    const conversationIds = (data ?? []).map((item) => item.id);
    const { data: cases, error: casesError } = conversationIds.length
      ? await this.client
          .from("recovery_cases")
          .select(
            "id, conversation_id, reference, status, estimated_value_minor, currency_code",
          )
          .eq("organization_id", input.organizationId)
          .in("conversation_id", conversationIds)
      : { data: [], error: null };
    if (casesError) {
      throw queryError("list_conversation_cases", casesError);
    }

    const casesByConversation = new Map(
      (cases ?? []).map((item) => [item.conversation_id, item]),
    );
    return {
      items: (data ?? []).map((item) => ({
        ...item,
        recoveryCase: casesByConversation.get(item.id) ?? null,
      })) as ConversationListItem[],
      total: count ?? 0,
    };
  }

  async getConversationDetail(organizationId: string, conversationId: string) {
    const { data: conversation, error } = await this.client
      .from("conversations")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("id", conversationId)
      .maybeSingle();
    if (error) throw queryError("get_conversation_detail", error);
    if (!conversation) throw new NotFoundError("Conversation not found.");

    const [contact, calls, messages, cases] = await Promise.all([
      this.client
        .from("contacts")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("id", conversation.contact_id)
        .single(),
      this.client
        .from("calls")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("conversation_id", conversationId)
        .order("started_at", { ascending: false }),
      this.client
        .from("messages")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true }),
      this.client
        .from("recovery_cases")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false }),
    ]);
    if (contact.error) throw queryError("conversation_contact", contact.error);
    if (calls.error) throw queryError("conversation_calls", calls.error);
    if (messages.error) throw queryError("conversation_messages", messages.error);
    if (cases.error) throw queryError("conversation_cases", cases.error);

    return {
      conversation,
      contact: contact.data,
      calls: calls.data ?? [],
      messages: messages.data ?? [],
      cases: cases.data ?? [],
    };
  }
}
