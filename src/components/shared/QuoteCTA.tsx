import { ButtonLink } from "./ui";

export function QuoteCTA({
  title = "Have a Shipment to Arrange?",
  text = "Tell us about your cargo, origin, destination, and delivery requirements. Our team can review the details and respond with the next steps.",
  buttonLabel = "Request a Quote",
  href = "/request-quote",
}: {
  title?: string;
  text?: string;
  buttonLabel?: string;
  href?: string;
}) {
  return (
    <section className="bg-navy-900 py-16 text-white sm:py-20">
      <div className="container-page flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold !text-white sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-white/80">{text}</p>
        </div>
        <ButtonLink href={href} arrow className="shrink-0 !px-7 !py-4">
          {buttonLabel}
        </ButtonLink>
      </div>
    </section>
  );
}
