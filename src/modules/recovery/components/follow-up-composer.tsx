"use client";

import { PaperPlaneTilt } from "@phosphor-icons/react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  draftFollowUpAction,
  initialRecoveryActionState,
} from "@/modules/recovery/actions/recovery-actions";
import { ActionFeedback } from "@/modules/recovery/components/action-feedback";

export function FollowUpComposer({
  contactName,
  recipient,
  recoveryCaseId,
}: {
  contactName: string;
  recipient: string;
  recoveryCaseId: string;
}) {
  const [state, action, pending] = useActionState(
    draftFollowUpAction,
    initialRecoveryActionState,
  );
  const defaultMessage = `Hi ${contactName}, this is the front desk following up on your missed call. We can help with your request. Reply here and our team will confirm the next available option.`;

  return (
    <form action={action} className="mt-5 space-y-4">
      <input name="recoveryCaseId" type="hidden" value={recoveryCaseId} />
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Recipient</span>
        <input
          className="bg-surface text-foreground min-h-10 w-full rounded-[var(--radius-control)] border px-3 text-sm"
          name="recipient"
          readOnly
          value={recipient}
        />
        <span className="text-muted-foreground mt-1.5 block text-xs leading-5">
          The recipient comes from this contact&apos;s verified tenant-scoped phone
          channel.
        </span>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Message</span>
        <textarea
          className="placeholder:text-muted-foreground min-h-32 w-full resize-y rounded-[var(--radius-control)] border bg-white px-3 py-2.5 text-sm leading-6"
          defaultValue={defaultMessage}
          maxLength={1000}
          name="body"
          required
        />
        <span className="text-muted-foreground mt-1.5 block text-xs leading-5">
          Saved as a draft. A manager must approve before the mock adapter records a send.
        </span>
      </label>
      <Button disabled={pending} type="submit">
        <PaperPlaneTilt aria-hidden="true" size={17} />
        {pending ? "Saving draft..." : "Save for approval"}
      </Button>
      <ActionFeedback state={state} />
    </form>
  );
}
