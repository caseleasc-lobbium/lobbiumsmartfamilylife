// Zentrale Eingabe-Validierung mit zod.
// Jede API-Route parst ihren Body über parseBody(schema, body) und erhält
// entweder { ok:true, data } oder { ok:false, error } mit sicherer Meldung.
import { z } from "zod";

export const emailSchema = z
  .string({ required_error: "E-Mail fehlt" })
  .trim()
  .min(3, "Ungültige E-Mail-Adresse")
  .max(120, "E-Mail-Adresse zu lang")
  .email("Ungültige E-Mail-Adresse");

export const contactSchema = z.object({
  name: z.string({ required_error: "Name fehlt" }).trim().min(1, "Name fehlt").max(100, "Name zu lang"),
  email: emailSchema,
  message: z
    .string({ required_error: "Nachricht fehlt" })
    .trim()
    .min(1, "Nachricht fehlt")
    .max(5000, "Nachricht zu lang"),
});

export const newsletterSchema = z.object({
  email: emailSchema,
  name: z.string().trim().max(100).nullish(),
  locale: z.enum(["de", "en", "fr"]).catch("en").default("en"),
});

export const loginSchema = z.object({
  password: z.string().min(1).max(200),
});

export const affiliateSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    category: z.string().trim().max(80).optional(),
    description: z.string().trim().max(2000).nullish(),
    imageUrl: z.string().trim().max(500).nullish(),
    image_url: z.string().trim().max(500).nullish(),
    link: z.string().trim().max(500).nullish(),
    affiliate_url: z.string().trim().max(500).nullish(),
  })
  .refine((d) => Boolean(d.link || d.affiliate_url), {
    message: "Partner-Link erforderlich",
    path: ["link"],
  });

export type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/** Body gegen ein Schema parsen; liefert die erste verständliche Fehlermeldung. */
export function parseBody<T>(schema: z.ZodType<T>, body: unknown): ParseResult<T> {
  const result = schema.safeParse(body);
  if (result.success) return { ok: true, data: result.data };
  const first = result.error.issues[0];
  return { ok: false, error: first?.message || "Ungültige Eingabe" };
}
