import { z } from 'zod';

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
  notifyEnquiriesTo: z.string().trim().email().or(z.literal('')).optional(),
});
