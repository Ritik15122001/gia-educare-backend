import slugify from 'slugify';

import { Destination } from '../models/Destination.js';
import { Course } from '../models/Course.js';
import { CourseCategory } from '../models/CourseCategory.js';
import { StudyLevel } from '../models/StudyLevel.js';
import { Service } from '../models/Service.js';
import { Testimonial } from '../models/Testimonial.js';
import { TeamMember } from '../models/TeamMember.js';
import { Milestone } from '../models/Milestone.js';
import { Value } from '../models/Value.js';
import { Stat } from '../models/Stat.js';
import { ProcessStep } from '../models/ProcessStep.js';
import { Faq } from '../models/Faq.js';
import { ComparisonRow } from '../models/ComparisonRow.js';
import { Post } from '../models/Post.js';
import { PostCategory } from '../models/PostCategory.js';
import { VideoTestimonial } from '../models/VideoTestimonial.js';
import { Exam } from '../models/Exam.js';
import { Client } from '../models/Client.js';

import * as V from '../validators/content.validators.js';

// Derives a slug from the title on create only. Slugs are URLs (/blog/:slug,
// /destinations/:slug) and the seed's upsert key, so renaming a record must not
// silently change them — that is how edited rows used to come back duplicated.
const autoSlug = (field) => (body, { isCreate }) => {
  if (isCreate && !body.slug && body[field]) body.slug = slugify(body[field], { lower: true, strict: true });
  return body;
};

/**
 * Single source of truth for every content collection.
 * Adding a new content type to the whole system — public API, admin API,
 * validation and audit log — means adding one entry here.
 */
export const RESOURCES = [
  {
    name: 'destinations',
    model: Destination,
    schema: V.destinationSchema,
    searchable: ['name', 'blurb', 'description', 'tag'],
    beforeWrite: autoSlug('name'),
    publicSort: 'order createdAt',
  },
  {
    name: 'courses',
    model: Course,
    schema: V.courseSchema,
    searchable: ['title', 'description', 'category', 'badge'],
    beforeWrite: autoSlug('title'),
  },
  { name: 'course-categories', model: CourseCategory, schema: V.courseCategorySchema, searchable: ['label', 'key'] },
  { name: 'study-levels', model: StudyLevel, schema: V.studyLevelSchema, searchable: ['title', 'description'] },
  {
    name: 'services',
    model: Service,
    schema: V.serviceSchema,
    searchable: ['title', 'description'],
    beforeWrite: autoSlug('title'),
  },
  { name: 'testimonials', model: Testimonial, schema: V.testimonialSchema, searchable: ['name', 'quote', 'program'] },
  { name: 'team', model: TeamMember, schema: V.teamMemberSchema, searchable: ['name', 'role', 'bio'] },
  { name: 'milestones', model: Milestone, schema: V.milestoneSchema, searchable: ['year', 'title', 'description'] },
  { name: 'values', model: Value, schema: V.valueSchema, searchable: ['title', 'description'] },
  { name: 'stats', model: Stat, schema: V.statSchema, searchable: ['label'] },
  { name: 'process-steps', model: ProcessStep, schema: V.processStepSchema, searchable: ['title', 'description'] },
  { name: 'faqs', model: Faq, schema: V.faqSchema, searchable: ['question', 'answer'] },
  { name: 'comparison-rows', model: ComparisonRow, schema: V.comparisonRowSchema, searchable: ['country', 'best'] },
  {
    name: 'posts',
    model: Post,
    schema: V.postSchema,
    searchable: ['title', 'excerpt', 'body', 'author', 'tags', 'category', 'destination', 'exam'],
    beforeWrite: autoSlug('title'),
  },
  {
    name: 'exams',
    model: Exam,
    schema: V.examSchema,
    searchable: ['name', 'fullName', 'kind', 'summary', 'usedFor'],
    beforeWrite: autoSlug('name'),
  },
  { name: 'clients', model: Client, schema: V.clientSchema, searchable: ['name', 'country'] },
  { name: 'post-categories', model: PostCategory, schema: V.postCategorySchema, searchable: ['label', 'key'] },
  {
    name: 'video-testimonials',
    model: VideoTestimonial,
    schema: V.videoTestimonialSchema,
    searchable: ['name', 'program', 'university', 'country', 'quote'],
  },
];

export const getResource = (name) => RESOURCES.find((r) => r.name === name);
