"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { toSafeError } from "@/lib/errors/safe-error";
import { resolveRequestId } from "@/lib/request/request-id";
import { MockMessagingProvider } from "@/modules/integrations/messaging/mock-messaging-provider";
import {
  assertCanApproveCustomerContact,
  assertCanManageRecovery,
} from "@/modules/recovery/domain/permissions";
import {
  approvalActionSchema,
  assignCaseSchema,
  draftFollowUpSchema,
  markBookedSchema,
} from "@/modules/recovery/schemas/recovery-schemas";
import { createRecoveryRequestContext } from "@/modules/recovery/runtime";
import { RecoveryActionService } from "@/modules/recovery/services/recovery-actions";

export type RecoveryActionState = {
  status: "idle" | "success" | "error";
  message: string;
  approvalId?: string;
};

export const initialRecoveryActionState: RecoveryActionState = {
  status: "idle",
  message: "",
};

async function actionRequestId() {
  return resolveRequestId(await headers());
}

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function failureState(error: unknown, requestId: string): RecoveryActionState {
  const safeError = toSafeError(error, requestId);
  return {
    status: "error",
    message: `${safeError.message} Request ID: ${safeError.requestId}`,
  };
}

export async function assignCaseAction(
  _previousState: RecoveryActionState,
  formData: FormData,
): Promise<RecoveryActionState> {
  const requestId = await actionRequestId();
  try {
    const parsed = assignCaseSchema.parse({
      recoveryCaseId: formValue(formData, "recoveryCaseId"),
    });
    const context = await createRecoveryRequestContext();
    assertCanManageRecovery(context.tenant.organizationRole);
    const service = new RecoveryActionService(
      context.commands,
      new MockMessagingProvider(),
    );
    await service.assignToMember({
      actor: context.actor,
      recoveryCaseId: parsed.recoveryCaseId,
      requestId,
    });
    revalidatePath(`/app/recovery/${parsed.recoveryCaseId}`);
    revalidatePath("/app/recovery");
    return { status: "success", message: "Recovery Case assigned to you." };
  } catch (error) {
    return failureState(error, requestId);
  }
}

export async function draftFollowUpAction(
  _previousState: RecoveryActionState,
  formData: FormData,
): Promise<RecoveryActionState> {
  const requestId = await actionRequestId();
  try {
    const parsed = draftFollowUpSchema.parse({
      recoveryCaseId: formValue(formData, "recoveryCaseId"),
      recipient: formValue(formData, "recipient"),
      body: formValue(formData, "body"),
    });
    const context = await createRecoveryRequestContext();
    assertCanManageRecovery(context.tenant.organizationRole);
    const service = new RecoveryActionService(
      context.commands,
      new MockMessagingProvider(),
    );
    const approval = await service.draftFollowUp({
      actor: context.actor,
      recoveryCaseId: parsed.recoveryCaseId,
      recipient: parsed.recipient,
      body: parsed.body,
      requestId,
    });
    revalidatePath(`/app/recovery/${parsed.recoveryCaseId}`);
    return {
      status: "success",
      message: "Draft saved. Review it below before approving the mock send.",
      approvalId: approval.id,
    };
  } catch (error) {
    return failureState(error, requestId);
  }
}

export async function approveAndExecuteAction(
  _previousState: RecoveryActionState,
  formData: FormData,
): Promise<RecoveryActionState> {
  const requestId = await actionRequestId();
  try {
    const parsed = approvalActionSchema.parse({
      approvalId: formValue(formData, "approvalId"),
    });
    const context = await createRecoveryRequestContext();
    assertCanApproveCustomerContact(context.tenant.organizationRole);
    const service = new RecoveryActionService(
      context.commands,
      new MockMessagingProvider(),
    );
    const result = await service.approveAndExecute({
      actor: context.actor,
      approvalId: parsed.approvalId,
      requestId,
    });
    revalidatePath(`/app/recovery/${result.approval.recovery_case_id}`);
    revalidatePath("/app");
    revalidatePath("/app/inbox");
    return {
      status: result.message.status === "sent" ? "success" : "error",
      message:
        result.message.status === "sent"
          ? "Approved. The mock adapter recorded the follow-up as sent."
          : "The deterministic mock adapter recorded a failure. No live message was sent.",
    };
  } catch (error) {
    return failureState(error, requestId);
  }
}

export async function markBookedAction(
  _previousState: RecoveryActionState,
  formData: FormData,
): Promise<RecoveryActionState> {
  const requestId = await actionRequestId();
  try {
    const parsed = markBookedSchema.parse({
      recoveryCaseId: formValue(formData, "recoveryCaseId"),
    });
    const context = await createRecoveryRequestContext();
    assertCanManageRecovery(context.tenant.organizationRole);
    const service = new RecoveryActionService(
      context.commands,
      new MockMessagingProvider(),
    );
    await service.markBooked({
      actor: context.actor,
      recoveryCaseId: parsed.recoveryCaseId,
      requestId,
    });
    revalidatePath(`/app/recovery/${parsed.recoveryCaseId}`);
    revalidatePath("/app/recovery");
    revalidatePath("/app");
    return {
      status: "success",
      message: "Booking confirmed. Recovered value is now confirmed.",
    };
  } catch (error) {
    return failureState(error, requestId);
  }
}
