import { z } from 'zod';
import { contentBase } from './common.validators.js';
import { SERVICE_ICONS } from '../models/Service.js';

const iconEnum = z.enum(SERVICE_ICONS);
const slug = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and dashes')
  .optional();

export const destinationSchema = z.object({
  slug,
  name: z.string().trim().min(2, 'Country name is required').max(120),
  flag: z.string().trim().max(8).optional(),
  tag: z.string().trim().max(60).optional(),
  bg: z.string().trim().max(300).optional(),
  imageUrl: z.string().trim().max(500).optional(),
  blurb: z.string().trim().max(400).optional(),
  description: z.string().trim().max(1200).optional(),
  meta: z.array(z.string().trim().max(60)).max(6).optional(),
  facts: z
    .array(z.object({ label: z.string().trim().min(1).max(60), value: z.string().trim().min(1).max(120) }))
    .max(10)
    .optional(),
  tags: z.array(z.string().trim().max(40)).max(10).optional(),
  showOnHome: z.boolean().optional(),
  ...contentBase,
});

export const courseSchema = z.object({
  slug,
  title: z.string().trim().min(2, 'Course title is required').max(160),
  category: z.string().trim().min(1, 'Pick a category'),
  icon: z.string().trim().max(8).optional(),
  badge: z.string().trim().max(40).optional(),
  description: z.string().trim().max(800).optional(),
  duration: z.string().trim().max(60).optional(),
  level: z.string().trim().max(60).optional(),
  tuition: z.string().trim().max(60).optional(),
  topPicks: z.string().trim().max(120).optional(),
  note: z.string().trim().max(160).optional(),
  ...contentBase,
});

export const courseCategorySchema = z.object({
  key: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and dashes'),
  label: z.string().trim().min(2).max(60),
  ...contentBase,
});

export const studyLevelSchema = z.object({
  num: z.string().trim().min(1).max(4),
  title: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).optional(),
  ...contentBase,
});

export const serviceSchema = z.object({
  slug,
  title: z.string().trim().min(2, 'Title is required').max(120),
  description: z.string().trim().max(600).optional(),
  icon: iconEnum.optional(),
  ...contentBase,
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(2, 'Student name is required').max(120),
  initials: z.string().trim().max(3).optional(),
  program: z.string().trim().max(120).optional(),
  quote: z.string().trim().min(10, 'Quote is too short').max(800),
  rating: z.number().int().min(1).max(5).optional(),
  avatarUrl: z.string().trim().max(500).optional(),
  ...contentBase,
});

export const teamMemberSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(120),
  initials: z.string().trim().max(3).optional(),
  role: z.string().trim().max(120).optional(),
  bio: z.string().trim().max(600).optional(),
  photoUrl: z.string().trim().max(500).optional(),
  linkedin: z.string().trim().max(300).optional(),
  ...contentBase,
});

export const milestoneSchema = z.object({
  year: z.string().trim().min(4).max(9),
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().max(500).optional(),
  ...contentBase,
});

export const valueSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500).optional(),
  icon: iconEnum.optional(),
  ...contentBase,
});

export const statSchema = z.object({
  value: z.coerce.number().min(0, 'Must be a positive number'),
  suffix: z.string().trim().max(4).optional(),
  label: z.string().trim().min(2).max(80),
  ...contentBase,
});

export const processStepSchema = z.object({
  num: z.string().trim().min(1).max(4),
  title: z.string().trim().min(2).max(80),
  description: z.string().trim().max(400).optional(),
  ...contentBase,
});

export const faqSchema = z.object({
  question: z.string().trim().min(5, 'Question is too short').max(300),
  answer: z.string().trim().min(10, 'Answer is too short').max(2000),
  ...contentBase,
});

export const comparisonRowSchema = z.object({
  country: z.string().trim().min(2).max(80),
  length: z.string().trim().max(60).optional(),
  tuition: z.string().trim().max(60).optional(),
  living: z.string().trim().max(60).optional(),
  work: z.string().trim().max(60).optional(),
  best: z.string().trim().max(120).optional(),
  ...contentBase,
});

export const sectionSchema = z.object({
  key: z.string().trim().min(3).max(80),
  label: z.string().trim().min(2).max(120),
  eyebrow: z.string().trim().max(80).optional(),
  title: z.string().trim().max(300).optional(),
  lead: z.string().trim().max(1200).optional(),
  ctaLabel: z.string().trim().max(80).optional(),
  items: z.array(z.any()).optional(),
});
