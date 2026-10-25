"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CARGO_CATEGORIES, FREIGHT_METHODS, INDUSTRY_OPTIONS, enquirySchema,
  type EnquiryData, type EnquiryInput,
} from "@/lib/validation/enquiry";
import { services } from "@/content/en/services";
import { FormField } from "./FormField";
import { FileUpload } from "./FileUpload";
import { Button, ErrorMessage, Notice, SuccessMessage } from "@/components/shared/ui";
import { newSubmissionId, type SubmitState, postSubmission } from "./submit-client";

const legend = "text-lg font-bold text-navy-900";
const fieldset = "rounded-xl border border-line bg-white p-5 shadow-card sm:p-7";

export function QuoteForm({ defaultIndustry }: { defaultIndustry?: (typeof INDUSTRY_OPTIONS)[number] }) {
  const [submissionId] = useState(newSubmissionId);
  const [startedAt] = useState(() => Date.now());
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>();
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const inFlight = useRef(false);

  const {
    register, handleSubmit, setError, formState: { errors }, setFocus,
  } = useForm<EnquiryInput, unknown, EnquiryData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      industry: defaultIndustry,
      destinationCountry: "Cambodia",
      freightMethod: "Not sure",
      services: [],
      submissionId,
      startedAt,
      website: "",
    },
  });

  async function onSubmit(values: EnquiryData) {
    if (inFlight.current) return; // duplicate-submission guard
    inFlight.current = true;
    setState({ status: "submitting" });
    const formData = new FormData();
    formData.append("payload", JSON.stringify({ ...values, submissionId, startedAt }));
    files.forEach((f) => formData.append("documents", f));
    const result = await postSubmission("/api/enquiries", formData);
    inFlight.current = false;
    if (result.status === "error" && result.fieldErrors) {
      for (const [name, message] of Object.entries(result.fieldErrors)) {
        if (name === "documents") setFileError(message);
        else setError(name as keyof EnquiryInput, { message });
      }
    }
    setState(result);
  }

  if (state.status === "success") {
    return (
      <SuccessMessage title="Enquiry received">
        <p>
          Thank you for contacting KHQ Services. Your enquiry has been received. Please retain your enquiry
          reference for follow-up.
        </p>
        <p className="rounded-lg bg-white px-4 py-3 text-lg font-bold tracking-wide text-navy-900">
          Reference: <span data-testid="reference">{state.reference}</span>
        </p>
        <p className="text-sm text-muted">
          This is an acknowledgement, not a quotation or a booking. Our team will review your details and respond
          with the next steps.
        </p>
      </SuccessMessage>
    );
  }

  if (state.status === "demo") {
    return (
      <div role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-amber-900">Demo mode — nothing was sent</h2>
        <p className="mt-3 leading-relaxed text-amber-900">
          Your details passed validation, but this website is running in demo mode: no enquiry was stored or sent,
          and no reference number was issued. The site owner needs to enable enquiry storage before real enquiries
          can be received.
        </p>
      </div>
    );
  }

  const submitting = state.status === "submitting";

  return (
    <form onSubmit={(e) =>
      void handleSubmit(onSubmit, (errs) => {
        const first = Object.keys(errs)[0] as keyof EnquiryInput | undefined;
        if (first) setFocus(first);
      })(e)
    } noValidate className="space-y-8" aria-busy={submitting}>
      <input type="hidden" {...register("submissionId")} />
      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input type="text" tabIndex={-1} autoComplete="off" {...register("website")} /></label>
      </div>

      <fieldset className={fieldset}>
        <legend className={`${legend} px-1`}>A. Customer details</legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <FormField id="companyName" label="Company name" required registration={register("companyName")} error={errors.companyName} autoComplete="organization" />
          <FormField id="contactPerson" label="Contact person" required registration={register("contactPerson")} error={errors.contactPerson} autoComplete="name" />
          <FormField id="email" label="Business email" required type="email" registration={register("email")} error={errors.email} autoComplete="email" />
          <FormField id="phone" label="Telephone or messaging contact" required registration={register("phone")} error={errors.phone} hint="Phone number, Telegram, WhatsApp, or similar." autoComplete="tel" />
          <div className="sm:col-span-2 sm:max-w-md">
            <FormField id="industry" label="Industry" required as="select" options={INDUSTRY_OPTIONS} placeholderOption="Select your industry" registration={register("industry")} error={errors.industry} />
          </div>
        </div>
      </fieldset>

      <fieldset className={fieldset}>
        <legend className={`${legend} px-1`}>B. Shipment details</legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField id="cargoDescription" label="Cargo description" required as="textarea" rows={3} registration={register("cargoDescription")} error={errors.cargoDescription} hint="What are you shipping? Include models or item types where possible." />
          </div>
          <FormField id="cargoCategory" label="Cargo category" as="select" options={CARGO_CATEGORIES} placeholderOption="Select a category" registration={register("cargoCategory")} error={errors.cargoCategory} />
          <FormField id="quantity" label="Cartons, pallets, or units" registration={register("quantity")} error={errors.quantity} placeholder="e.g. 4 pallets" />
          <FormField id="weight" label="Estimated weight" registration={register("weight")} error={errors.weight} placeholder="e.g. 850 kg" />
          <FormField id="dimensions" label="Dimensions" registration={register("dimensions")} error={errors.dimensions} placeholder="e.g. 120 × 80 × 100 cm per pallet" />
          <FormField id="cargoValue" label="Estimated cargo value" registration={register("cargoValue")} error={errors.cargoValue} placeholder="e.g. USD 25,000" />
          <FormField id="originCountry" label="Country of origin" required registration={register("originCountry")} error={errors.originCountry} />
          <div className="sm:col-span-2">
            <FormField id="pickupAddress" label="Supplier pickup address" as="textarea" rows={2} registration={register("pickupAddress")} error={errors.pickupAddress} />
          </div>
          <FormField id="destinationCountry" label="Destination country" required registration={register("destinationCountry")} error={errors.destinationCountry} />
          <FormField id="deliveryLocation" label="Delivery city or address" registration={register("deliveryLocation")} error={errors.deliveryLocation} />
          <FormField id="freightMethod" label="Preferred freight method" as="select" options={FREIGHT_METHODS} registration={register("freightMethod")} error={errors.freightMethod} />
          <FormField id="preferredDate" label="Preferred delivery date" type="date" registration={register("preferredDate")} error={errors.preferredDate} />
          <div className="sm:col-span-2">
            <FormField id="specialHandling" label="Special handling requirements" as="textarea" rows={2} registration={register("specialHandling")} error={errors.specialHandling} />
          </div>
          <div className="sm:col-span-2">
            <FormField id="notes" label="Additional notes" as="textarea" rows={3} registration={register("notes")} error={errors.notes} />
          </div>
        </div>
      </fieldset>

      <fieldset className={fieldset}>
        <legend className={`${legend} px-1`}>C. Service requirements</legend>
        <p className="mt-2 text-sm text-muted">Select all that apply. Availability is confirmed in your quotation.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {services.map((s) => (
            <label key={s.slug} className="flex cursor-pointer items-start gap-3 rounded-lg border border-line p-3 text-sm hover:bg-surface">
              <input type="checkbox" value={s.slug} {...register("services")} className="mt-0.5 h-4 w-4 rounded border-line accent-brand" />
              <span>{s.title}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={fieldset}>
        <legend className={`${legend} px-1`}>D. Supporting documents</legend>
        <div className="mt-4">
          <FileUpload files={files} onChange={setFiles} error={fileError} onError={setFileError} />
        </div>
        <div className="mt-4">
          <Notice>Documents are stored privately and are not shared with third parties without your authorization.</Notice>
        </div>
      </fieldset>

      {state.status === "error" && <ErrorMessage>{state.message}</ErrorMessage>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" loading={submitting} className="!px-8 !py-3.5">
          {submitting ? "Submitting…" : "Submit enquiry"}
        </Button>
        <p className="text-xs text-muted">Fields marked * are required.</p>
      </div>
    </form>
  );
}
