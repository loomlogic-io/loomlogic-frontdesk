"use client";

import { ShieldCheck } from "@phosphor-icons/react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  approveAndExecuteAction,
  initialRecoveryActionState,
} from "@/modules/recovery/actions/recovery-actions";
import { ActionFeedback } from "@/modules/recovery/components/action-feedback";

export function ApprovalForm({ approvalId }: { approvalId: string }) {
  const [state, action, pending] = useActionState(
    approveAndExecuteAction,
    initialRecoveryActionState,
  );

  return (
    <form action={action}>
      <input name="approvalId" type="hidden" value={approvalId} />
      <Button disabled={pending} size="sm" type="submit">
        <ShieldCheck aria-hidden="true" size={16} />
        {pending ? "Executing mock send..." : "Approve and run mock send"}
      </Button>
      <ActionFeedback state={state} />
    </form>
  );
}
