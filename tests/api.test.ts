import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { resetRateLimits } from "@/lib/security/rate-limit";

let dir: string;
const base = {
  companyName: "Acme", contactPerson: "Dara", email: "a@acme.example", phone: "012",
  industry: "Manufacturing", cargoDescription: "pumps", originCountry: "China",
  destinationCountry: "Cambodia", freightMethod: "Sea", services: [], website: "",
};

async function post(payload: object, files: { name: string; content: BlobPart }[] = []) {
  const { POST } = await import("@/app/api/enquiries/route");
  const fd = new FormData();
  fd.append("payload", JSON.stringify(payload));
  for (const f of files) fd.append("documents", new File([f.content], f.name));
  const res = await POST(new Request("http://localhost/api/enquiries", { method: "POST", body: fd }));
  return { status: res.status, body: await res.json() };
}

beforeAll(() => {
  dir = mkdtempSync(path.join(tmpdir(), "khq-"));
  process.env.ENQUIRY_DATA_DIR = dir;
});
afterAll(() => rmSync(dir, { recursive: true, force: true }));
beforeEach(() => resetRateLimits());

describe("POST /api/enquiries", () => {
  it("demo mode validates but stores nothing and issues no reference", async () => {
    process.env.ENQUIRY_STORAGE = "demo";
    const r = await post({ ...base, submissionId: randomUUID() });
    expect(r.body).toEqual({ ok: true, demo: true });
  });

  it("persists a valid enquiry privately and returns a reference", async () => {
    process.env.ENQUIRY_STORAGE = "file";
    const r = await post({ ...base, submissionId: randomUUID() }, [{ name: "bom.pdf", content: "%PDF-1.4" }]);
    expect(r.status).toBe(200);
    expect(r.body.reference).toMatch(/^KHQ-\d{6}-/);
    expect(readdirSync(path.join(dir, "enquiries"))).toContain(`${r.body.reference}.json`);
    expect(readdirSync(path.join(dir, "uploads", r.body.reference))).toHaveLength(1);
  });

  it("returns the same reference for a repeated submission id", async () => {
    process.env.ENQUIRY_STORAGE = "file";
    const id = randomUUID();
    const a = await post({ ...base, submissionId: id });
    const b = await post({ ...base, submissionId: id });
    expect(b.body.duplicate).toBe(true);
    expect(b.body.reference).toBe(a.body.reference);
  });

  it("rejects invalid input and unsafe files", async () => {
    process.env.ENQUIRY_STORAGE = "file";
    expect((await post({ ...base, email: "x", submissionId: randomUUID() })).status).toBe(400);
    const bad = await post({ ...base, submissionId: randomUUID() }, [{ name: "x.pdf", content: "MZ not a pdf" }]);
    expect(bad.status).toBe(400);
    const exe = await post({ ...base, submissionId: randomUUID() }, [{ name: "x.exe", content: "MZ" }]);
    expect(exe.status).toBe(400);
  });

  it("rate limits repeated submissions", async () => {
    process.env.ENQUIRY_STORAGE = "demo";
    let last = 0;
    for (let i = 0; i < 7; i++) last = (await post({ ...base, submissionId: randomUUID() })).status;
    expect(last).toBe(429);
  });
});
