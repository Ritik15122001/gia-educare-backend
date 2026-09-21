import { z } from 'zod';

// Footer policy links: either a path on the website ("/privacy-policy") or a
// full link to a policy hosted elsewhere.
const legalLink = z
  .string()
  .trim()
  .max(500)
  .refine((v) => !v || /^(https?:\/\/|\/)/i.test(v), 'Use a page path like /privacy-policy, or a full https:// link')
  .optional();

export const settingsSchema = z.object({
  brand: z.string().trim().min(1).max(80).optional(),
  tagline: z.string().trim().max(120).optional(),
  logoUrl: z.string().trim().max(500).optional(),
  topbarMessage: z.string().trim().max(200).optional(),
  phonePrimary: z.string().trim().max(30).optional(),
  phoneSecondary: z.string().trim().max(30).optional(),
  emailPrimary: z.string().trim().email().or(z.literal('')).optional(),
  emailAdmissions: z.string().trim().email().or(z.literal('')).optional(),
  hours: z.string().trim().max(120).optional(),
  addressLine: z.string().trim().max(200).optional(),
  footerBlurb: z.string().trim().max(600).optional(),
  offices: z
    .array(
      z.object({
        name: z.string().trim().min(2).max(120),
        address: z.string().trim().min(4).max(300),
        phone: z.string().trim().max(30).optional(),
        hours: z.string().trim().max(80).optional(),
        order: z.number().int().min(0).optional(),
      }),
    )
    .optional(),
  socials: z
    .object({
      facebook: z.string().trim().max(300).optional(),
      instagram: z.string().trim().max(300).optional(),
      linkedin: z.string().trim().max(300).optional(),
      youtube: z.string().trim().max(300).optional(),
      whatsapp: z.string().trim().max(300).optional(),
    })
    .optional(),
  seo: z
    .object({
      title: z.string().trim().max(160).optional(),
      description: z.string().trim().max(320).optional(),
    })
    .optional(),
  // Comma-separated so a lead alert can reach more than one inbox.
  notifyEnquiriesTo: z
    .string()
    .trim()
    .max(500)
    .refine(
      (v) => !v || v.split(',').every((e) => z.string().email().safeParse(e.trim()).success),
      'Use valid email addresses, separated by commas',
    )
    .optional(),
  legalEntity: z.string().trim().max(160).optional(),
  legalLinks: z
    .object({
      // A path such as /privacy-policy points at the website's own policy pages;
      // a full https:// link is still accepted for a policy hosted elsewhere.
      privacy: legalLink,
      terms: legalLink,
      refund: legalLink,
    })
    .optional(),
  mapUrl: z.string().trim().max(500).refine((v) => !v || /^https?:\/\//i.test(v), 'Use a full https:// link').optional(),
  founder: z
    .object({
      enabled: z.boolean().optional(),
      name: z.string().trim().max(120).optional(),
      title: z.string().trim().max(120).optional(),
      photoUrl: z.string().trim().max(500).optional(),
      message: z.string().trim().max(1200).optional(),
      email: z.string().trim().email().or(z.literal('')).optional(),
      phone: z.string().trim().max(30).optional(),
      whatsapp: z.string().trim().max(30).optional(),
      linkedin: z.string().trim().max(300).optional(),
      instagram: z.string().trim().max(300).optional(),
      youtube: z.string().trim().max(300).optional(),
      twitter: z.string().trim().max(300).optional(),
      facebook: z.string().trim().max(300).optional(),
    })
    .optional(),
});
