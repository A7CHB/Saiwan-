"use client";

import { useActionState } from "react";
import { INQUIRY_STATUSES } from "@/lib/constants";
import { updateInquiryAction, type ActionState } from "@/lib/admin/actions";
import { AdminSelect, AdminTextarea, FormMessage, SubmitButton } from "@/components/admin/form";

const initial: ActionState = {};

/** Status + internal notes. A status change is appended to the timeline. */
export function InquiryForm({
  id,
  status,
  adminNotes,
}: {
  id: string;
  status: string;
  adminNotes: string;
}) {
  const [state, action] = useActionState(updateInquiryAction, initial);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={id} />
      <FormMessage state={state} />

      <AdminSelect label="Status" name="status" defaultValue={status}>
        {INQUIRY_STATUSES.map((option) => (
          <option key={option} value={option}>
            {option.toLowerCase()}
          </option>
        ))}
      </AdminSelect>

      <AdminTextarea
        label="Internal notes"
        name="adminNotes"
        defaultValue={adminNotes}
        rows={5}
        hint="Never shown to the customer."
      />

      <SubmitButton className="self-start">Update inquiry</SubmitButton>
    </form>
  );
}
