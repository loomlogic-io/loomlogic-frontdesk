import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { AppError, NotFoundError } from "@/lib/errors/app-error";
import type { Database, TablesInsert, TablesUpdate } from "@/types/database.generated";

function databaseError(operation: string, error: { code?: string; message: string }) {
  return new AppError(
    "INTERNAL_ERROR",
    "The recovery operation could not be completed.",
    {
      status: 500,
      cause: error,
      details: {
        operation,
        databaseCode: error.code ?? "unknown",
      },
    },
  );
}

export type ApplicationActor = {
  organizationId: string;
  organizationName: string;
  locale: string;
  timeZone: string;
  currencyCode: string;
  userId: string;
  membershipId: string;
  role: string;
};

export class RecoveryCommandRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async resolveOrganizationByReceivingNumber(toNumber: string) {
    const { data, error } = await this.client
      .from("phone_numbers")
      .select("id, organization_id, e164_number")
      .eq("e164_number", toNumber)
      .eq("provider", "development_fixture")
      .eq("status", "active")
      .maybeSingle();

    if (error) {
      throw databaseError("resolve_receiving_number", error);
    }

    if (!data) {
      throw new NotFoundError(
        "No active development receiving-number mapping was found.",
      );
    }

    return data;
  }

  async resolveApplicationActor(
    clerkOrganizationId: string,
    clerkUserId: string,
  ): Promise<ApplicationActor> {
    const { data: organization, error: organizationError } = await this.client
      .from("organizations")
      .select("id, name, locale, time_zone, currency_code")
      .eq("clerk_org_id", clerkOrganizationId)
      .single();

    if (organizationError) {
      throw databaseError("resolve_actor_organization", organizationError);
    }

    const { data: user, error: userError } = await this.client
      .from("users")
      .select("id")
      .eq("clerk_user_id", clerkUserId)
      .single();

    if (userError) {
      throw databaseError("resolve_actor_user", userError);
    }

    const { data: membership, error: membershipError } = await this.client
      .from("organization_members")
      .select("id, role")
      .eq("organization_id", organization.id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (membershipError) {
      throw databaseError("resolve_actor_membership", membershipError);
    }

    return {
      organizationId: organization.id,
      organizationName: organization.name,
      locale: organization.locale,
      timeZone: organization.time_zone,
      currencyCode: organization.currency_code,
      userId: user.id,
      membershipId: membership.id,
      role: membership.role,
    };
  }

  async getWebhookEvent(organizationId: string, providerEventId: string) {
    const { data, error } = await this.client
      .from("webhook_events")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("provider", "development_fixture")
      .eq("provider_event_id", providerEventId)
      .maybeSingle();

    if (error) {
      throw databaseError("get_webhook_event", error);
    }

    return data;
  }

  async ensureWebhookEvent(input: TablesInsert<"webhook_events">) {
    const { error } = await this.client.from("webhook_events").upsert(input, {
      onConflict: "provider,provider_event_id",
      ignoreDuplicates: true,
    });

    if (error) {
      throw databaseError("ensure_webhook_event", error);
    }

    const event = await this.getWebhookEvent(
      input.organization_id,
      input.provider_event_id,
    );
    if (!event) {
      throw new AppError("INTERNAL_ERROR", "Webhook receipt was not persisted.", {
        status: 500,
      });
    }

    return event;
  }

  async updateWebhookEvent(id: string, update: TablesUpdate<"webhook_events">) {
    const { error } = await this.client
      .from("webhook_events")
      .update(update)
      .eq("id", id);

    if (error) {
      throw databaseError("update_webhook_event", error);
    }
  }

  async findContactByPhone(organizationId: string, normalizedPhone: string) {
    const { data: channel, error: channelError } = await this.client
      .from("contact_channels")
      .select("contact_id")
      .eq("organization_id", organizationId)
      .eq("type", "phone")
      .eq("normalized_value", normalizedPhone)
      .maybeSingle();

    if (channelError) {
      throw databaseError("find_contact_channel", channelError);
    }

    if (!channel) {
      return null;
    }

    const { data: contact, error: contactError } = await this.client
      .from("contacts")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("id", channel.contact_id)
      .single();

    if (contactError) {
      throw databaseError("find_contact", contactError);
    }

    return contact;
  }

  async ensureContact(
    contact: TablesInsert<"contacts">,
    channel: TablesInsert<"contact_channels">,
  ) {
    const existing = await this.findContactByPhone(
      contact.organization_id,
      channel.normalized_value,
    );

    if (existing) {
      return existing;
    }

    const { error: contactError } = await this.client
      .from("contacts")
      .upsert(contact, { onConflict: "id", ignoreDuplicates: true });

    if (contactError) {
      throw databaseError("ensure_contact", contactError);
    }

    const { error: channelError } = await this.client
      .from("contact_channels")
      .upsert(channel, {
        onConflict: "organization_id,type,normalized_value",
        ignoreDuplicates: true,
      });

    if (channelError) {
      const racedContact = await this.findContactByPhone(
        contact.organization_id,
        channel.normalized_value,
      );
      if (racedContact) {
        return racedContact;
      }
      throw databaseError("ensure_contact_channel", channelError);
    }

    const { data, error } = await this.client
      .from("contacts")
      .select("*")
      .eq("organization_id", contact.organization_id)
      .eq("id", contact.id!)
      .single();

    if (error) {
      throw databaseError("read_ensured_contact", error);
    }

    return data;
  }

  async ensureConversation(input: TablesInsert<"conversations">) {
    const { error } = await this.client
      .from("conversations")
      .upsert(input, { onConflict: "id", ignoreDuplicates: true });

    if (error) {
      throw databaseError("ensure_conversation", error);
    }

    const { data, error: readError } = await this.client
      .from("conversations")
      .select("*")
      .eq("organization_id", input.organization_id)
      .eq("id", input.id!)
      .single();
    if (readError) {
      throw databaseError("read_ensured_conversation", readError);
    }
    return data;
  }

  async ensureCall(input: TablesInsert<"calls">) {
    const { error } = await this.client.from("calls").upsert(input, {
      onConflict: "provider,provider_call_id",
      ignoreDuplicates: true,
    });

    if (error) {
      throw databaseError("ensure_call", error);
    }

    const { data, error: readError } = await this.client
      .from("calls")
      .select("*")
      .eq("organization_id", input.organization_id)
      .eq("provider", input.provider)
      .eq("provider_call_id", input.provider_call_id)
      .single();

    if (readError) {
      throw databaseError("read_ensured_call", readError);
    }

    return data;
  }

  async ensureCallEvent(input: TablesInsert<"call_events">) {
    const { error } = await this.client.from("call_events").upsert(input, {
      onConflict: "provider_event_id",
      ignoreDuplicates: true,
    });
    if (error) {
      throw databaseError("ensure_call_event", error);
    }
  }

  async ensureRecoveryCase(input: TablesInsert<"recovery_cases">) {
    const { error } = await this.client.from("recovery_cases").upsert(input, {
      onConflict: "organization_id,source_call_id",
      ignoreDuplicates: true,
    });
    if (error) {
      throw databaseError("ensure_recovery_case", error);
    }

    const { data, error: readError } = await this.client
      .from("recovery_cases")
      .select("*")
      .eq("organization_id", input.organization_id)
      .eq("source_call_id", input.source_call_id)
      .single();

    if (readError) {
      throw databaseError("read_ensured_recovery_case", readError);
    }

    return data;
  }

  async ensureRecoveryCaseEvent(input: TablesInsert<"recovery_case_events">) {
    const { error } = await this.client
      .from("recovery_case_events")
      .upsert(input, { onConflict: "id", ignoreDuplicates: true });
    if (error) {
      throw databaseError("ensure_recovery_case_event", error);
    }
  }

  async ensureTask(input: TablesInsert<"tasks">) {
    const { error } = await this.client
      .from("tasks")
      .upsert(input, { onConflict: "id", ignoreDuplicates: true });
    if (error) {
      throw databaseError("ensure_task", error);
    }
  }

  async ensureAttribution(input: TablesInsert<"revenue_attributions">) {
    const { error } = await this.client.from("revenue_attributions").upsert(input, {
      onConflict: "organization_id,recovery_case_id,level",
      ignoreDuplicates: true,
    });
    if (error) {
      throw databaseError("ensure_attribution", error);
    }
  }

  async ensureOutboxEvent(input: TablesInsert<"outbox_events">) {
    const { error } = await this.client.from("outbox_events").upsert(input, {
      onConflict: "organization_id,idempotency_key",
      ignoreDuplicates: true,
    });
    if (error) {
      throw databaseError("ensure_outbox_event", error);
    }
  }

  async ensureAuditLog(input: TablesInsert<"audit_logs">) {
    const { error } = await this.client
      .from("audit_logs")
      .upsert(input, { onConflict: "id", ignoreDuplicates: true });
    if (error) {
      throw databaseError("ensure_audit_log", error);
    }
  }

  async getRecoveryCase(organizationId: string, recoveryCaseId: string) {
    const { data, error } = await this.client
      .from("recovery_cases")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("id", recoveryCaseId)
      .single();
    if (error) {
      throw databaseError("get_recovery_case", error);
    }
    return data;
  }

  async getCall(organizationId: string, callId: string) {
    const { data, error } = await this.client
      .from("calls")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("id", callId)
      .single();
    if (error) {
      throw databaseError("get_call", error);
    }
    return data;
  }

  async getPrimaryPhone(organizationId: string, contactId: string) {
    const { data, error } = await this.client
      .from("contact_channels")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("contact_id", contactId)
      .eq("type", "phone")
      .order("is_primary", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw databaseError("get_primary_phone", error);
    }
    if (!data) {
      throw new NotFoundError("This contact does not have a phone channel.");
    }
    return data;
  }

  async createMessage(input: TablesInsert<"messages">) {
    const { data, error } = await this.client
      .from("messages")
      .insert(input)
      .select()
      .single();
    if (error) {
      throw databaseError("create_message", error);
    }
    return data;
  }

  async createApproval(input: TablesInsert<"action_approvals">) {
    const { data, error } = await this.client
      .from("action_approvals")
      .insert(input)
      .select()
      .single();
    if (error) {
      throw databaseError("create_approval", error);
    }
    return data;
  }

  async getApproval(organizationId: string, approvalId: string) {
    const { data, error } = await this.client
      .from("action_approvals")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("id", approvalId)
      .single();
    if (error) {
      throw databaseError("get_action_approval", error);
    }
    return data;
  }

  async getApprovalByIdempotency(organizationId: string, idempotencyKey: string) {
    const { data, error } = await this.client
      .from("action_approvals")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("idempotency_key", idempotencyKey)
      .maybeSingle();
    if (error) {
      throw databaseError("get_approval_by_idempotency", error);
    }
    return data;
  }

  async getMessage(organizationId: string, messageId: string) {
    const { data, error } = await this.client
      .from("messages")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("id", messageId)
      .single();
    if (error) {
      throw databaseError("get_message", error);
    }
    return data;
  }

  async updateApproval(id: string, update: TablesUpdate<"action_approvals">) {
    const { error } = await this.client
      .from("action_approvals")
      .update(update)
      .eq("id", id);
    if (error) {
      throw databaseError("update_approval", error);
    }
  }

  async updateMessage(id: string, update: TablesUpdate<"messages">) {
    const { error } = await this.client.from("messages").update(update).eq("id", id);
    if (error) {
      throw databaseError("update_message", error);
    }
  }

  async updateRecoveryCase(id: string, update: TablesUpdate<"recovery_cases">) {
    const { error } = await this.client
      .from("recovery_cases")
      .update(update)
      .eq("id", id);
    if (error) {
      throw databaseError("update_recovery_case", error);
    }
  }

  async getMockAttempt(organizationId: string, idempotencyKey: string) {
    const { data, error } = await this.client
      .from("mock_message_attempts")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("idempotency_key", idempotencyKey)
      .maybeSingle();
    if (error) {
      throw databaseError("get_mock_attempt", error);
    }
    return data;
  }

  async createMockAttempt(input: TablesInsert<"mock_message_attempts">) {
    const { data, error } = await this.client
      .from("mock_message_attempts")
      .insert(input)
      .select()
      .single();
    if (error) {
      throw databaseError("create_mock_attempt", error);
    }
    return data;
  }
}
