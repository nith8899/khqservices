export type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; reference: string }
  | { status: "demo" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

export function newSubmissionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  // Fallback for non-secure contexts
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/** POSTs to an API route and maps the response into UI state. Never reports success unless the server says so. */
export async function postSubmission(url: string, body: FormData | object): Promise<SubmitState> {
  try {
    const isForm = body instanceof FormData;
    const res = await fetch(url, {
      method: "POST",
      body: isForm ? body : JSON.stringify(body),
      headers: isForm ? undefined : { "Content-Type": "application/json" },
    });
    let json: {
      ok?: boolean; demo?: boolean; reference?: string; message?: string; errors?: Record<string, string>;
    } = {};
    try {
      json = await res.json();
    } catch {
      /* non-JSON error response */
    }
    if (res.ok && json.ok) {
      if (json.demo) return { status: "demo" };
      if (json.reference) return { status: "success", reference: json.reference };
    }
    return {
      status: "error",
      message: json.message ?? "Something went wrong while sending your enquiry. Please try again.",
      fieldErrors: json.errors,
    };
  } catch {
    return {
      status: "error",
      message: "We could not reach the server. Please check your connection and try again.",
    };
  }
}
