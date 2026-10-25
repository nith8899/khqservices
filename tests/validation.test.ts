import { describe, expect, it } from "vitest";
import { contactSchema, enquirySchema } from "@/lib/validation/enquiry";
import { precheckFile, sanitizeFilename, verifyFileContent } from "@/lib/validation/files";
import { generateReference, REFERENCE_PATTERN } from "@/lib/enquiries/reference";
import { rateLimit, resetRateLimits } from "@/lib/security/rate-limit";

const valid = {
  companyName: "Acme Ltd",
  contactPerson: "Sok Dara",
  email: "buyer@acme.example",
  phone: "+855 12 000 000",
  industry: "IT & Technology",
  cargoDescription: "4 rack servers",
  originCountry: "Singapore",
  destinationCountry: "Cambodia",
  freightMethod: "Air",
  services: ["international-freight-coordination"],
  submissionId: "3f1c6f9e-6f0b-4f1e-9a55-0d2f4e2b7c11",
};

describe("enquiry schema", () => {
  it("accepts a valid enquiry", () => {
    expect(enquirySchema.safeParse(valid).success).toBe(true);
  });
  it("requires mandatory fields", () => {
    const r = enquirySchema.safeParse({ ...valid, companyName: "", cargoDescription: "", originCountry: "" });
    expect(r.success).toBe(false);
    const paths = r.success ? [] : r.error.issues.map((i) => i.path[0]);
    expect(paths).toEqual(expect.arrayContaining(["companyName", "cargoDescription", "originCountry"]));
  });
  it("rejects invalid email", () => {
    expect(enquirySchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });
  it("rejects unknown industry and service", () => {
    expect(enquirySchema.safeParse({ ...valid, industry: "Mining" }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...valid, services: ["teleportation"] }).success).toBe(false);
  });
  it("rejects a filled honeypot and past dates", () => {
    expect(enquirySchema.safeParse({ ...valid, website: "http://spam" }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...valid, preferredDate: "2000-01-01" }).success).toBe(false);
  });
  it("rejects control characters", () => {
    expect(enquirySchema.safeParse({ ...valid, companyName: "Acme\u0000" }).success).toBe(false);
  });
});

describe("contact schema", () => {
  it("validates", () => {
    const base = { name: "A", email: "a@b.co", message: "Hi", submissionId: valid.submissionId };
    expect(contactSchema.safeParse(base).success).toBe(true);
    expect(contactSchema.safeParse({ ...base, email: "x" }).success).toBe(false);
  });
});

describe("file validation", () => {
  const pdf = new TextEncoder().encode("%PDF-1.7 test");
  it("accepts matching content", () => {
    expect(verifyFileContent("bom.pdf", pdf).ok).toBe(true);
  });
  it("rejects disallowed extensions", () => {
    expect(precheckFile({ name: "run.exe", size: 10 }).ok).toBe(false);
    expect(precheckFile({ name: "page.html", size: 10 }).ok).toBe(false);
  });
  it("rejects content that does not match the extension", () => {
    const exe = new Uint8Array([0x4d, 0x5a, 0x90, 0x00]);
    expect(verifyFileContent("fake.pdf", exe).ok).toBe(false);
    expect(verifyFileContent("fake.png", pdf).ok).toBe(false);
  });
  it("rejects oversize and empty files", () => {
    expect(precheckFile({ name: "a.pdf", size: 11 * 1024 * 1024 }).ok).toBe(false);
    expect(precheckFile({ name: "a.pdf", size: 0 }).ok).toBe(false);
  });
  it("rejects binary content labelled csv", () => {
    expect(verifyFileContent("a.csv", new Uint8Array([0, 1, 2, 3])).ok).toBe(false);
    expect(verifyFileContent("a.csv", new TextEncoder().encode("a,b\n1,2")).ok).toBe(true);
  });
  it("sanitizes filenames", () => {
    expect(sanitizeFilename("../../etc/passwd")).toBe("passwd");
    expect(sanitizeFilename("a<b>.pdf")).toBe("a_b_.pdf");
  });
});

describe("references and rate limiting", () => {
  it("generates well-formed unique references", () => {
    const refs = new Set(Array.from({ length: 200 }, () => generateReference()));
    expect(refs.size).toBe(200);
    for (const r of refs) expect(r).toMatch(REFERENCE_PATTERN);
  });
  it("limits after the threshold and recovers", () => {
    resetRateLimits();
    const t = 1_000_000;
    for (let i = 0; i < 3; i++) expect(rateLimit("ip", 3, 1000, t + i).allowed).toBe(true);
    expect(rateLimit("ip", 3, 1000, t + 10).allowed).toBe(false);
    expect(rateLimit("ip", 3, 1000, t + 5000).allowed).toBe(true);
  });
});
