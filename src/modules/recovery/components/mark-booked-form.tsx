"use client";

import { CalendarCheck } from "@phosphor-icons/react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  initialRecoveryActionState,
  markBookedAction,
} from "@/modules/recovery/actions/recovery-actions";
import { ActionFeedback } from "@/modules/recovery/components/action-feedback";

export function MarkBookedForm({ recoveryCaseId }: { recoveryCaseId: string }) {
  const [state, action, pending] = useActionState(
    markBookedAction,
    initialRecoveryActionState,
  );

  return (
    <form action={action}>
      <input name="recoveryCaseId" type="hidden" value={recoveryCaseId} />
      <Button disabled={pending} size="sm" type="submit" variant="secondary">
        <CalendarCheck aria-hidden="true" size={16} />
        {pending ? "Confirming..." : "Mark booked"}
      </Button>
      <ActionFeedback state={state} />
    </form>
  );
}
