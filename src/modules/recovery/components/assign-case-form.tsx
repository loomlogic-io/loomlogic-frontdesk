"use client";

import { UserPlus } from "@phosphor-icons/react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  assignCaseAction,
  initialRecoveryActionState,
} from "@/modules/recovery/actions/recovery-actions";
import { ActionFeedback } from "@/modules/recovery/components/action-feedback";

export function AssignCaseForm({ recoveryCaseId }: { recoveryCaseId: string }) {
  const [state, action, pending] = useActionState(
    assignCaseAction,
    initialRecoveryActionState,
  );

  return (
    <form action={action}>
      <input name="recoveryCaseId" type="hidden" value={recoveryCaseId} />
      <Button disabled={pending} size="sm" type="submit" variant="secondary">
        <UserPlus aria-hidden="true" size={16} />
        {pending ? "Assigning..." : "Assign to me"}
      </Button>
      <ActionFeedback state={state} />
    </form>
  );
}
