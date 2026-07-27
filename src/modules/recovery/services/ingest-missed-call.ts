import "server-only";

import { createAttribution } from "@/modules/recovery/domain/attribution";
import {
  deterministicUuid,
  recoveryReference,
} from "@/modules/recovery/domain/idempotency";
import type { RecoveryCommandRepository } from "@/modules/recovery/repositories/recovery-command-repository";
import type { MissedCallFixture } from "@/modules/recovery/schemas/recovery-schemas";
import type { Json } from "@/types/database.generated";

export type IngestMissedCallInput = {
  fixture: MissedCallFixture;
  rawPayload: Json;
  payloadHash: string;
  requestId: string;
  receivedAt: Date;
};

export type IngestMissedCallResult = {
  duplicate: boolean;
  webhookEventId: string;
  recoveryCaseId: string;
  reference: string;
};

export class IngestMissedCallService {
  constructor(private readonly repository: RecoveryCommandRepository) {}

  async execute(input: IngestMissedCallInput): Promise<IngestMissedCallResult> {
    const organizationMapping =
      await this.repository.resolveOrganizationByReceivingNumber(input.fixture.to_number);
    const organizationId = organizationMapping.organization_id;
    const existing = await this.repository.getWebhookEvent(
      organizationId,
      input.fixture.provider_event_id,
    );

    if (existing?.status === "processed") {
      const recoveryCaseId = deterministicUuid(
        "recovery-case",
        input.fixture.provider_event_id,
      );
      const recoveryCase = await this.repository.getRecoveryCase(
        organizationId,
        recoveryCaseId,
      );

      return {
        duplicate: true,
        webhookEventId: existing.id,
        recoveryCaseId: recoveryCase.id,
        reference: recoveryCase.reference,
      };
    }

    const webhookEventId = deterministicUuid(
      "webhook-event",
      input.fixture.provider_event_id,
    );
    const webhook = await this.repository.ensureWebhookEvent({
      id: webhookEventId,
      organization_id: organizationId,
      provider: "development_fixture",
      provider_event_id: input.fixture.provider_event_id,
      event_type: "missed_call",
      signature_verified: true,
      payload_hash: input.payloadHash,
      raw_payload: input.rawPayload,
      status: "received",
      attempt_count: 0,
      received_at: input.receivedAt.toISOString(),
    });

    await this.repository.updateWebhookEvent(webhook.id, {
      status: "processing",
      attempt_count: webhook.attempt_count + 1,
      last_error_code: null,
    });

    try {
      const contactId = deterministicUuid("contact", input.fixture.provider_event_id);
      const contact = await this.repository.ensureContact(
        {
          id: contactId,
          organization_id: organizationId,
          first_name: input.fixture.contact.first_name ?? null,
          last_name: input.fixture.contact.last_name ?? null,
          display_name: input.fixture.contact.display_name,
          preferred_language: "en",
          consent_status: "unknown",
          metadata: {
            demo: true,
            source: "development_fixture",
          },
          is_demo: true,
        },
        {
          id: deterministicUuid("contact-channel", input.fixture.provider_event_id),
          organization_id: organizationId,
          contact_id: contactId,
          type: "phone",
          normalized_value: input.fixture.from_number,
          display_value: input.fixture.from_number,
          is_primary: true,
          is_verified: false,
          consent_status: "unknown",
        },
      );

      const conversationId = deterministicUuid(
        "conversation",
        input.fixture.provider_event_id,
      );
      const occurredAt = new Date(input.fixture.occurred_at);
      const conversation = await this.repository.ensureConversation({
        id: conversationId,
        organization_id: organizationId,
        contact_id: contact.id,
        primary_channel: "phone",
        status: "open",
        subject: input.fixture.reason,
        summary: input.fixture.summary,
        last_activity_at: occurredAt.toISOString(),
        is_demo: true,
      });

      const callId = deterministicUuid("call", input.fixture.provider_event_id);
      const call = await this.repository.ensureCall({
        id: callId,
        organization_id: organizationId,
        conversation_id: conversation.id,
        contact_id: contact.id,
        phone_number_id: organizationMapping.id,
        provider: "development_fixture",
        provider_call_id: input.fixture.provider_call_id,
        direction: "inbound",
        status: "missed",
        from_number: input.fixture.from_number,
        to_number: input.fixture.to_number,
        started_at: occurredAt.toISOString(),
        ended_at: occurredAt.toISOString(),
        duration_seconds: 0,
        disposition: "unanswered",
        routing_outcome: "no_answer",
        summary: input.fixture.summary,
        intent: input.fixture.intent,
        recording_consent_state: "not_recorded",
        metadata: {
          demo: true,
          fixture_outcome: input.fixture.fixture_outcome,
        },
        is_demo: true,
      });

      await this.repository.ensureCallEvent({
        id: deterministicUuid("call-event", input.fixture.provider_event_id),
        organization_id: organizationId,
        call_id: call.id,
        provider_event_id: input.fixture.provider_event_id,
        event_type: "missed_call",
        sequence: 1,
        occurred_at: occurredAt.toISOString(),
        payload: {
          demo: true,
          normalized: true,
          payload_hash: input.payloadHash,
        },
      });

      const recoveryCaseId = deterministicUuid(
        "recovery-case",
        input.fixture.provider_event_id,
      );
      const reference = recoveryReference(input.fixture.provider_event_id);
      const dueAt = new Date(occurredAt.getTime() + 30 * 60 * 1000);
      const recoveryCase = await this.repository.ensureRecoveryCase({
        id: recoveryCaseId,
        organization_id: organizationId,
        contact_id: contact.id,
        conversation_id: conversation.id,
        source_call_id: call.id,
        reference,
        category: "missed_call",
        reason: input.fixture.reason,
        status: "new",
        urgency: input.fixture.urgency,
        estimated_value_minor: input.fixture.estimated_value_minor,
        currency_code: input.fixture.currency_code,
        attribution_level: "estimated",
        next_action_type: "review_case",
        next_action_due_at: dueAt.toISOString(),
        opened_at: occurredAt.toISOString(),
        is_demo: true,
      });

      await this.repository.ensureRecoveryCaseEvent({
        id: deterministicUuid("recovery-case-event", input.fixture.provider_event_id),
        organization_id: organizationId,
        recovery_case_id: recoveryCase.id,
        event_type: "case.created",
        actor_type: "webhook",
        source_type: "webhook",
        source_id: webhook.id,
        description: "Verified development missed call opened a Recovery Case.",
        metadata: {
          demo: true,
          provider_event_id: input.fixture.provider_event_id,
        },
        occurred_at: occurredAt.toISOString(),
      });

      await this.repository.ensureTask({
        id: deterministicUuid("task", input.fixture.provider_event_id),
        organization_id: organizationId,
        title: `Review ${input.fixture.contact.display_name}'s missed call`,
        description: input.fixture.reason,
        status: "open",
        priority: input.fixture.urgency,
        due_at: dueAt.toISOString(),
        contact_id: contact.id,
        conversation_id: conversation.id,
        recovery_case_id: recoveryCase.id,
      });

      const attribution = createAttribution({
        level: "estimated",
        amountMinor: input.fixture.estimated_value_minor,
        currencyCode: input.fixture.currency_code,
        caseStatus: "new",
        evidenceReference: reference,
      });

      await this.repository.ensureAttribution({
        id: deterministicUuid("attribution-estimated", input.fixture.provider_event_id),
        organization_id: organizationId,
        recovery_case_id: recoveryCase.id,
        level: attribution.level,
        amount_minor: attribution.amountMinor,
        currency_code: attribution.currencyCode,
        confidence: attribution.confidence,
        evidence_type: attribution.evidenceType,
        evidence_reference: attribution.evidenceReference,
        attributed_at: occurredAt.toISOString(),
      });

      await this.repository.ensureOutboxEvent({
        id: deterministicUuid("outbox", input.fixture.provider_event_id),
        organization_id: organizationId,
        aggregate_type: "recovery_case",
        aggregate_id: recoveryCase.id,
        event_type: "recovery_case.created",
        idempotency_key: `recovery-case-created:${input.fixture.provider_event_id}`,
        payload: {
          demo: true,
          recovery_case_id: recoveryCase.id,
        },
        status: "pending",
        available_at: input.receivedAt.toISOString(),
      });

      await this.repository.ensureAuditLog({
        id: deterministicUuid("audit", input.fixture.provider_event_id),
        organization_id: organizationId,
        actor_type: "webhook",
        action: "recovery_case.created",
        target_type: "recovery_case",
        target_id: recoveryCase.id,
        source: "webhook",
        request_id: input.requestId,
        metadata: {
          demo: true,
          provider: "development_fixture",
          provider_event_id: input.fixture.provider_event_id,
        },
      });

      await this.repository.updateWebhookEvent(webhook.id, {
        status: "processed",
        processed_at: input.receivedAt.toISOString(),
      });

      return {
        duplicate: Boolean(existing),
        webhookEventId: webhook.id,
        recoveryCaseId: recoveryCase.id,
        reference: recoveryCase.reference,
      };
    } catch (error) {
      await this.repository.updateWebhookEvent(webhook.id, {
        status: "failed",
        last_error_code: "RECOVERY_INGESTION_FAILED",
      });
      throw error;
    }
  }
}
