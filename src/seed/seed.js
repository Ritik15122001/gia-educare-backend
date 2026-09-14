/**
 * Seeds the database with the site's launch content and a super-admin account.
 *
 *   npm run seed         upsert — safe to re-run, keeps existing edits
 *   npm run seed:fresh   wipes content collections first
 */
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { connectDb, disconnectDb } from '../config/db.js';

import { User } from '../models/User.js';
import { SiteSetting } from '../models/SiteSetting.js';
import { Section } from '../models/Section.js';
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

import { ensureDefaultRoles } from '../services/access.service.js';

import * as data from './data.js';

const fresh = process.argv.includes('--fresh');

// Upsert on a natural key so re-running never duplicates rows.
async function sync(Model, rows, key) {
  let created = 0;
  let updated = 0;

  for (const [index, row] of rows.entries()) {
    const doc = { ...row, order: row.order ?? index };
    if (key) {
      const res = await Model.updateOne({ [key]: row[key] }, { $setOnInsert: doc }, { upsert: true });
      if (res.upsertedCount) created += 1;
      else updated += 1;
    } else {
      // Collections with no natural key are matched on their first text field.
      const match = row.title ? { title: row.title } : row.question ? { question: row.question } : row.label ? { label: row.label } : { name: row.name };
      const res = await Model.updateOne(match, { $setOnInsert: doc }, { upsert: true });
      if (res.upsertedCount) created += 1;
      else updated += 1;
    }
  }

  logger.info(`${Model.modelName.padEnd(16)} ${String(created).padStart(3)} created, ${updated} already present`);
}

async function run() {
  await connectDb();

  if (fresh) {
    logger.warn('--fresh: clearing content collections (users and enquiries are kept)');
    await Promise.all([
      Destination.deleteMany({}), Course.deleteMany({}), CourseCategory.deleteMany({}),
      StudyLevel.deleteMany({}), Service.deleteMany({}), Testimonial.deleteMany({}),
      TeamMember.deleteMany({}), Milestone.deleteMany({}), Value.deleteMany({}),
      Stat.deleteMany({}), ProcessStep.deleteMany({}), Faq.deleteMany({}),
      ComparisonRow.deleteMany({}), Section.deleteMany({}), Post.deleteMany({}), PostCategory.deleteMany({}), VideoTestimonial.deleteMany({}), Exam.deleteMany({}), Client.deleteMany({}),
    ]);
  }

  await sync(Service, data.services, 'slug');
  await sync(Destination, data.destinations, 'slug');
  await sync(CourseCategory, data.courseCategories, 'key');
  await sync(Course, data.courses, 'slug');
  await sync(StudyLevel, data.studyLevels, 'num');
  await sync(Testimonial, data.testimonials, 'name');
  await sync(TeamMember, data.team, 'name');
  await sync(Milestone, data.milestones, 'year');
  await sync(Value, data.values, 'title');
  await sync(Stat, data.stats, 'label');
  await sync(ProcessStep, data.processSteps, 'num');
  await sync(Faq, data.faqs, 'question');
  await sync(ComparisonRow, data.comparisonRows, 'country');
  await sync(Exam, data.exams, 'slug');
  await sync(Client, data.clients, 'name');
  await sync(PostCategory, data.postCategories, 'key');
  await sync(Post, data.posts, 'slug');
  await sync(Section, data.sections, 'key');

  // Site settings singleton — only fill offices on first creation.
  const settings = await SiteSetting.getSingleton();
  if (!settings.founder?.name) {
    settings.founder = data.founder;
    await settings.save();
    logger.info('SiteSetting     founder seeded');
  }
  if (!settings.offices?.length) {
    settings.offices = data.offices;
    await settings.save();
    logger.info('SiteSetting     offices seeded');
  }

  await ensureDefaultRoles();

  // Super admin
  const existingAdmin = await User.findOne({ email: env.SEED_ADMIN_EMAIL });
  if (existingAdmin) {
    logger.info(`User             super admin already exists (${env.SEED_ADMIN_EMAIL})`);
  } else {
    await User.create({
      name: env.SEED_ADMIN_NAME,
      email: env.SEED_ADMIN_EMAIL,
      password: env.SEED_ADMIN_PASSWORD,
      role: 'super_admin',
    });
    logger.info(`User             super admin created → ${env.SEED_ADMIN_EMAIL} / ${env.SEED_ADMIN_PASSWORD}`);
  }

  logger.info('Seed complete');
  await disconnectDb();
  process.exit(0);
}

run().catch(async (err) => {
  logger.error(`Seed failed: ${err.message}`, { stack: err.stack });
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
