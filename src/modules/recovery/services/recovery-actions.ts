import "server-only";

import { createAttribution } from "@/modules/recovery/domain/attribution";
import { deterministicUuid } from "@/modules/recovery/domain/idempotency";
import {
  transitionRecoveryCase,
  type RecoveryCaseStatus,
} from "@/modules/recovery/domain/recovery-case";
import type { MessagingProvider } from "@/modules/integrations/messaging/messaging-provider";
import { ConflictError, NotFoundError } from "@/lib/errors/app-error";
import type { RecoveryCommandRepository } from "@/modules/recovery/repositories/recovery-command-repository";

type Actor = {
  organizationId: string;
  userId: string;
  membershipId: string;
};

export class RecoveryActionService {
  constructor(
    private readonly repository: RecoveryCommandRepository,
    private readonly messagingProvider: MessagingProvider,
    private readonly clock: () => Date = () => new Date(),
  ) {}

  async assignToMember(input: {
    actor: Actor;
    recoveryCaseId: string;
    requestId: string;
  }) {
    const recoveryCase = await this.repository.getRecoveryCase(
      input.actor.organizationId,
      input.recoveryCaseId,
    );

    if (recoveryCase.assigned_member_id === input.actor.membershipId) {
      return recoveryCase;
    }

    const now = this.clock();
    const transition =
      recoveryCase.status === "new"
        ? transitionRecoveryCase("new", "awaiting_staff", { now })
        : null;

    await this.repository.updateRecoveryCase(recoveryCase.id, {
      assigned_member_id: input.actor.membershipId,
      ...(transition ? { status: transition.status } : {}),
      next_action_type: "draft_follow_up",
    });

    const idempotencyKey = `assign:${recoveryCase.id}:${input.actor.membershipId}`;
    await this.repository.ensureRecoveryCaseEvent({
      id: deterministicUuid("case-assignment-event", idempotencyKey),
      organization_id: input.actor.organizationId,
      recovery_case_id: recoveryCase.id,
      event_type: "case.assigned",
      actor_type: "user",
      actor_user_id: input.actor.userId,
      source_type: "user",
      source_id: input.actor.membershipId,
      description: "Recovery Case assigned for follow-up.",
      occurred_at: now.toISOString(),
    });
    await this.repository.ensureAuditLog({
      id: deterministicUuid("case-assignment-audit", idempotencyKey),
      organization_id: input.actor.organizationId,
      actor_type: "user",
      actor_user_id: input.actor.userId,
      action: "recovery_case.assigned",
      target_type: "recovery_case",
      target_id: recoveryCase.id,
      source: "user",
      request_id: input.requestId,
      metadata: { assigned_membership_id: input.actor.membershipId },
    });

    return this.repository.getRecoveryCase(
      input.actor.organizationId,
      input.recoveryCaseId,
    );
  }

  async draftFollowUp(input: {
    actor: Actor;
    recoveryCaseId: string;
    recipient: string;
    body: string;
    idempotencyKey: string;
    requestId: string;
  }) {
    const existingApproval = await this.repository.getApprovalByIdempotency(
      input.actor.organizationId,
      input.idempotencyKey,
    );
    if (existingApproval) {
      return existingApproval;
    }

    const recoveryCase = await this.repository.getRecoveryCase(
      input.actor.organizationId,
      input.recoveryCaseId,
    );

    if (
      ["booked", "recovered", "disqualified", "opted_out", "lost", "closed"].includes(
        recoveryCase.status,
      )
    ) {
      throw new ConflictError("A resolved Recovery Case cannot start a new follow-up.");
    }

    const [primaryPhone, sourceCall] = await Promise.all([
      this.repository.getPrimaryPhone(
        input.actor.organizationId,
        recoveryCase.contact_id,
      ),
      this.repository.getCall(input.actor.organizationId, recoveryCase.source_call_id),
    ]);
    if (primaryPhone.normalized_value !== input.recipient) {
      throw new ConflictError(
        "The reviewed recipient is not the contact's phone channel.",
      );
    }

    const sourceMetadata =
      sourceCall.metadata &&
      typeof sourceCall.metadata === "object" &&
      !Array.isArray(sourceCall.metadata)
        ? sourceCall.metadata
        : {};
    const now = this.clock();
    const messageId = deterministicUuid("message", input.idempotencyKey);
    const message = await this.repository.createMessage({
      id: messageId,
      organization_id: input.actor.organizationId,
      conversation_id: recoveryCase.conversation_id,
      contact_id: recoveryCase.contact_id,
      recovery_case_id: recoveryCase.id,
      provider: "mock",
      idempotency_key: `message:${input.idempotencyKey}`,
      direction: "outbound",
      channel: "sms",
      status: "draft",
      recipient: input.recipient,
      body: input.body,
      metadata: {
        demo: recoveryCase.is_demo,
        provider_is_mock: true,
        fixture_outcome:
          sourceMetadata.fixture_outcome === "failure" ? "failure" : "success",
      },
    });

    const approval = await this.repository.createApproval({
      id: deterministicUuid("approval", input.idempotencyKey),
      organization_id: input.actor.organizationId,
      recovery_case_id: recoveryCase.id,
      message_id: message.id,
      requested_by_user_id: input.actor.userId,
      action_type: "send_follow_up",
      status: "pending",
      idempotency_key: input.idempotencyKey,
    });

    if (recoveryCase.status !== "engaging") {
      const transition = transitionRecoveryCase(
        recoveryCase.status as RecoveryCaseStatus,
        "engaging",
        { now },
      );
      await this.repository.updateRecoveryCase(recoveryCase.id, {
        status: transition.status,
        next_action_type: "approve_follow_up",
        next_action_due_at: null,
      });
    }

    await this.repository.ensureRecoveryCaseEvent({
      id: deterministicUuid("draft-event", input.idempotencyKey),
      organization_id: input.actor.organizationId,
      recovery_case_id: recoveryCase.id,
      event_type: "follow_up.drafted",
      actor_type: "user",
      actor_user_id: input.actor.userId,
      source_type: "user",
      source_id: approval.id,
      description: "Follow-up drafted and held for manager approval.",
      metadata: {
        approval_id: approval.id,
        channel: "sms",
      },
      occurred_at: now.toISOString(),
    });

    await this.repository.ensureAuditLog({
      id: deterministicUuid("draft-audit", input.idempotencyKey),
      organization_id: input.actor.organizationId,
      actor_type: "user",
      actor_user_id: input.actor.userId,
      action: "follow_up.drafted",
      target_type: "action_approval",
      target_id: approval.id,
      source: "user",
      request_id: input.requestId,
      metadata: {
        message_id: message.id,
        channel: "sms",
      },
    });

    return approval;
  }

  async approveAndExecute(input: {
    actor: Actor;
    approvalId: string;
    requestId: string;
  }) {
    const approval = await this.repository.getApproval(
      input.actor.organizationId,
      input.approvalId,
    );
    const message = await this.repository.getMessage(
      input.actor.organizationId,
      approval.message_id,
    );
    const recoveryCase = await this.repository.getRecoveryCase(
      input.actor.organizationId,
      approval.recovery_case_id,
    );

    if (approval.status === "succeeded") {
      return { approval, message, duplicate: true };
    }

    if (!["pending", "approved", "failed"].includes(approval.status)) {
      throw new ConflictError("This follow-up cannot be approved in its current state.");
    }

    const sendIdempotencyKey = `send:${approval.idempotency_key}`;
    const previousAttempt = await this.repository.getMockAttempt(
      input.actor.organizationId,
      sendIdempotencyKey,
    );

    if (previousAttempt) {
      return {
        approval,
        message,
        duplicate: true,
      };
    }

    const now = this.clock();
    await this.repository.updateApproval(approval.id, {
      status: "approved",
      approved_by_user_id: input.actor.userId,
      approved_at: now.toISOString(),
      failure_code: null,
    });
    await this.repository.updateMessage(message.id, { status: "approved" });

    await this.repository.updateApproval(approval.id, { status: "executing" });
    await this.repository.updateMessage(message.id, { status: "sending" });

    const metadata =
      message.metadata &&
      typeof message.metadata === "object" &&
      !Array.isArray(message.metadata)
        ? message.metadata
        : {};
    const fixtureOutcome =
      metadata.fixture_outcome === "failure"
        ? ("failure" as const)
        : ("success" as const);

    const result = await this.messagingProvider.sendText({
      organizationId: input.actor.organizationId,
      messageId: message.id,
      recipient: message.recipient,
      body: message.body,
      idempotencyKey: sendIdempotencyKey,
      correlationId: input.requestId,
      fixtureOutcome,
    });

    await this.repository.createMockAttempt({
      id: deterministicUuid("mock-attempt", sendIdempotencyKey),
      organization_id: input.actor.organizationId,
      message_id: message.id,
      idempotency_key: sendIdempotencyKey,
      outcome: result.status === "sent" ? "succeeded" : "failed",
      provider_message_id: result.status === "sent" ? result.providerMessageId : null,
      error_code: result.status === "failed" ? result.errorCode : null,
      attempted_at: now.toISOString(),
    });

    if (result.status === "failed") {
      await this.repository.updateMessage(message.id, {
        status: "failed",
        failed_at: now.toISOString(),
        error_code: result.errorCode,
      });
      await this.repository.updateApproval(approval.id, {
        status: "failed",
        failure_code: result.errorCode,
      });

      await this.repository.ensureRecoveryCaseEvent({
        id: deterministicUuid("send-failed-event", sendIdempotencyKey),
        organization_id: input.actor.organizationId,
        recovery_case_id: recoveryCase.id,
        event_type: "follow_up.failed",
        actor_type: "system",
        source_type: "mock_provider",
        source_id: approval.id,
        description: "Mock follow-up failed. No live message was attempted.",
        metadata: { error_code: result.errorCode },
        occurred_at: now.toISOString(),
      });
      await this.repository.ensureAuditLog({
        id: deterministicUuid("send-failed-audit", sendIdempotencyKey),
        organization_id: input.actor.organizationId,
        actor_type: "user",
        actor_user_id: input.actor.userId,
        action: "follow_up.approved_and_failed",
        target_type: "message",
        target_id: message.id,
        source: "user",
        request_id: input.requestId,
        metadata: {
          approval_id: approval.id,
          provider: "mock",
          error_code: result.errorCode,
        },
      });

      return {
        approval: await this.repository.getApproval(
          input.actor.organizationId,
          approval.id,
        ),
        message: await this.repository.getMessage(input.actor.organizationId, message.id),
        duplicate: false,
      };
    }

    await this.repository.updateMessage(message.id, {
      status: "sent",
      provider_message_id: result.providerMessageId,
      sent_at: now.toISOString(),
      failed_at: null,
      error_code: null,
    });
    await this.repository.updateApproval(approval.id, {
      status: "succeeded",
      executed_at: now.toISOString(),
      failure_code: null,
    });

    const transition = transitionRecoveryCase(
      recoveryCase.status as RecoveryCaseStatus,
      "awaiting_customer",
      { now },
    );
    await this.repository.updateRecoveryCase(recoveryCase.id, {
      status: transition.status,
      next_action_type: "await_customer_reply",
      next_action_due_at: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    });

    await this.repository.ensureRecoveryCaseEvent({
      id: deterministicUuid("send-succeeded-event", sendIdempotencyKey),
      organization_id: input.actor.organizationId,
      recovery_case_id: recoveryCase.id,
      event_type: "follow_up.sent",
      actor_type: "user",
      actor_user_id: input.actor.userId,
      source_type: "mock_provider",
      source_id: approval.id,
      description: "Approved follow-up recorded by the mock messaging adapter.",
      metadata: {
        provider: "mock",
        provider_message_id: result.providerMessageId,
      },
      occurred_at: now.toISOString(),
    });
    await this.repository.ensureAuditLog({
      id: deterministicUuid("send-audit", sendIdempotencyKey),
      organization_id: input.actor.organizationId,
      actor_type: "user",
      actor_user_id: input.actor.userId,
      action: "follow_up.approved_and_sent",
      target_type: "message",
      target_id: message.id,
      source: "user",
      request_id: input.requestId,
      metadata: {
        approval_id: approval.id,
        provider: "mock",
      },
    });

    return {
      approval: await this.repository.getApproval(
        input.actor.organizationId,
        approval.id,
      ),
      message: await this.repository.getMessage(input.actor.organizationId, message.id),
      duplicate: false,
    };
  }

  async markBooked(input: { actor: Actor; recoveryCaseId: string; requestId: string }) {
    const recoveryCase = await this.repository.getRecoveryCase(
      input.actor.organizationId,
      input.recoveryCaseId,
    );

    if (recoveryCase.status === "booked" || recoveryCase.status === "recovered") {
      return recoveryCase;
    }

    const now = this.clock();
    const transition = transitionRecoveryCase(
      recoveryCase.status as RecoveryCaseStatus,
      "booked",
      { now, resolutionType: "booked" },
    );

    await this.repository.updateRecoveryCase(recoveryCase.id, {
      status: transition.status,
      resolution_type: transition.resolutionType,
      resolved_at: transition.resolvedAt,
      lost_reason: transition.lostReason,
      attribution_level: "confirmed",
      next_action_type: null,
      next_action_due_at: null,
    });

    const attribution = createAttribution({
      level: "confirmed",
      amountMinor: recoveryCase.estimated_value_minor,
      currencyCode: recoveryCase.currency_code,
      caseStatus: "booked",
      evidenceReference: recoveryCase.reference,
    });
    const idempotencyKey = `booked:${recoveryCase.id}`;
    await this.repository.ensureAttribution({
      id: deterministicUuid("confirmed-attribution", idempotencyKey),
      organization_id: input.actor.organizationId,
      recovery_case_id: recoveryCase.id,
      level: attribution.level,
      amount_minor: attribution.amountMinor,
      currency_code: attribution.currencyCode,
      confidence: attribution.confidence,
      evidence_type: attribution.evidenceType,
      evidence_reference: attribution.evidenceReference,
      attributed_at: now.toISOString(),
    });
    await this.repository.ensureRecoveryCaseEvent({
      id: deterministicUuid("booked-event", idempotencyKey),
      organization_id: input.actor.organizationId,
      recovery_case_id: recoveryCase.id,
      event_type: "case.booked",
      actor_type: "user",
      actor_user_id: input.actor.userId,
      source_type: "user",
      source_id: recoveryCase.id,
      description: "Booking confirmed and recovered value upgraded to confirmed.",
      metadata: {
        amount_minor: attribution.amountMinor,
        currency_code: attribution.currencyCode,
      },
      occurred_at: now.toISOString(),
    });
    await this.repository.ensureAuditLog({
      id: deterministicUuid("booked-audit", idempotencyKey),
      organization_id: input.actor.organizationId,
      actor_type: "user",
      actor_user_id: input.actor.userId,
      action: "recovery_case.booked",
      target_type: "recovery_case",
      target_id: recoveryCase.id,
      source: "user",
      request_id: input.requestId,
      metadata: {
        amount_minor: attribution.amountMinor,
        currency_code: attribution.currencyCode,
      },
    });

    const updated = await this.repository.getRecoveryCase(
      input.actor.organizationId,
      input.recoveryCaseId,
    );
    if (!updated) {
      throw new NotFoundError();
    }
    return updated;
  }
}
