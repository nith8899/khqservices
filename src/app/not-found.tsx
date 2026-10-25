import { ButtonLink } from "@/components/shared/ui";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand">404</p>
      <h1 className="mt-3 text-4xl font-bold">Page not found</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">
        The page you are looking for does not exist or has moved.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/services" variant="outline">View services</ButtonLink>
      </div>
    </div>
  );
}
