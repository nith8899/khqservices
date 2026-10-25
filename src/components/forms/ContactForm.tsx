"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactData, type ContactInput } from "@/lib/validation/enquiry";
import { FormField } from "./FormField";
import { Button, ErrorMessage, SuccessMessage } from "@/components/shared/ui";
import { newSubmissionId, postSubmission, type SubmitState } from "./submit-client";

export function ContactForm() {
  const [submissionId] = useState(newSubmissionId);
  const [startedAt] = useState(() => Date.now());
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const inFlight = useRef(false);
  const { register, handleSubmit, setError, formState: { errors } } = useForm<ContactInput, unknown, ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { submissionId, startedAt, website: "" },
  });

  async function onSubmit(values: ContactData) {
    if (inFlight.current) return;
    inFlight.current = true;
    setState({ status: "submitting" });
    const result = await postSubmission("/api/contact", { ...values, submissionId, startedAt });
    inFlight.current = false;
    if (result.status === "error" && result.fieldErrors) {
      for (const [name, message] of Object.entries(result.fieldErrors)) {
        setError(name as keyof ContactInput, { message });
      }
    }
    setState(result);
  }

  if (state.status === "success") {
    return (
      <SuccessMessage title="Message received">
        <p>
          Thank you for contacting KHQ Services. Your enquiry has been received. Please retain your enquiry
          reference for follow-up.
        </p>
        <p className="font-bold">Reference: <span data-testid="reference">{state.reference}</span></p>
      </SuccessMessage>
    );
  }
  if (state.status === "demo") {
    return (
      <div role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-6 text-amber-900">
        <h2 className="text-xl font-bold">Demo mode — nothing was sent</h2>
        <p className="mt-2">Your message passed validation, but enquiry storage is not enabled on this site, so it was not stored or sent.</p>
      </div>
    );
  }
  const submitting = state.status === "submitting";
  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} noValidate className="space-y-5" aria-busy={submitting}>
      <input type="hidden" {...register("submissionId")} />
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input type="text" tabIndex={-1} autoComplete="off" {...register("website")} /></label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="c-name" label="Name" required registration={register("name")} error={errors.name} autoComplete="name" />
        <FormField id="c-company" label="Company" registration={register("company")} error={errors.company} autoComplete="organization" />
        <FormField id="c-email" label="Business email" required type="email" registration={register("email")} error={errors.email} autoComplete="email" />
        <FormField id="c-phone" label="Telephone or messaging contact" registration={register("phone")} error={errors.phone} autoComplete="tel" />
      </div>
      <FormField id="c-message" label="Message" required as="textarea" rows={5} registration={register("message")} error={errors.message} />
      {state.status === "error" && <ErrorMessage>{state.message}</ErrorMessage>}
      <Button type="submit" loading={submitting}>{submitting ? "Sending…" : "Send message"}</Button>
    </form>
  );
}
