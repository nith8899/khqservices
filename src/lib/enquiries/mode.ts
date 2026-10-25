export type StorageMode = "file" | "demo";

/** "file" persists enquiries privately on disk; anything else is demo mode (nothing stored or sent). */
export const storageMode = (): StorageMode =>
  process.env.ENQUIRY_STORAGE === "file" ? "file" : "demo";
