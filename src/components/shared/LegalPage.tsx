import type { ReactNode } from "react";
import { PageHero } from "./PageHero";
import { Notice, Section } from "./ui";

export function LegalPage({
  title,
  intro,
  sections,
  breadcrumb,
}: {
  title: string;
  intro: string;
  breadcrumb: string;
  sections: { heading: string; body: ReactNode }[];
}) {
  return (
    <>
      <PageHero title={title} description={intro} breadcrumbs={[{ label: breadcrumb }]} />
      <Section>
        <div className="max-w-3xl">
          <Notice tone="warning" title="Template — legal review required">
            This document is a customizable template and has not been reviewed by a lawyer. It must be reviewed and
            completed before the website is used in production.
          </Notice>
          <div className="mt-10 space-y-10">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-xl font-bold">{s.heading}</h2>
                <div className="mt-3 space-y-3 leading-relaxed">{s.body}</div>
              </section>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
