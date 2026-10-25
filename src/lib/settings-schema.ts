import { z } from "zod";

/** Client-safe schema for admin-editable settings (no Node APIs). */
const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .refine((v) => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(v), "Invalid characters");

export const settingsSchema = z.object({
  email: z.union([z.literal(""), z.email("Enter a valid email.").max(254)]),
  phone: text(60),
  messaging: text(120),
  address: text(400),
  hours: text(200),
  social: z
    .array(
      z.object({
        label: text(40).refine((v) => v.length > 0, "Label required"),
        href: z
          .url("Enter a full URL.")
          .max(300)
          .refine((v) => /^https?:\/\//i.test(v), "Must start with http(s)://"),
      }),
    )
    .max(6),
});
export type EditableSettings = z.infer<typeof settingsSchema>;

