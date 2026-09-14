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
import { Section } from '../models/Section.js';
import { SiteSetting } from '../models/SiteSetting.js';

/**
 * The whole marketing site in a single payload. The website fetches this once
 * on boot rather than firing a dozen requests, and every collection is already
 * filtered to published rows and sorted the way it renders.
 */
export async function getSiteContent() {
  const [
    settings,
    sections,
    destinations,
    courses,
    courseCategories,
    studyLevels,
    services,
    testimonials,
    team,
    milestones,
    values,
    stats,
    processSteps,
    faqs,
    comparisonRows,
    posts,
    postCategories,
    videoTestimonials,
    exams,
  ] = await Promise.all([
    SiteSetting.getSingleton(),
    Section.find().sort('key'),
    Destination.findPublished(),
    Course.findPublished(),
    CourseCategory.findPublished(),
    StudyLevel.findPublished(),
    Service.findPublished(),
    Testimonial.findPublished(),
    TeamMember.findPublished(),
    Milestone.findPublished(),
    Value.findPublished(),
    Stat.findPublished(),
    ProcessStep.findPublished(),
    Faq.findPublished(),
    ComparisonRow.findPublished(),
    Post.findPublished(),
    PostCategory.findPublished(),
    VideoTestimonial.findPublished(),
    Exam.findPublished(),
  ]);

  // Sections are keyed for O(1) lookup on the frontend.
  const sectionMap = sections.reduce((acc, s) => {
    const { key, eyebrow, title, lead, ctaLabel, items } = s.toJSON();
    acc[key] = { eyebrow, title, lead, ctaLabel, items };
    return acc;
  }, {});

  return {
    settings,
    sections: sectionMap,
    destinations,
    destinationsHome: destinations.filter((d) => d.showOnHome),
    courses,
    courseCategories,
    studyLevels,
    services,
    testimonials,
    team,
    // The home carousel shows featured counsellors, in the order they were dragged.
    counsellors: team.filter((m) => m.featured),
    milestones,
    values,
    stats,
    processSteps,
    faqs,
    comparisonRows,
    posts,
    // The home page teases only the three most recent, mirroring destinationsHome.
    postsRecent: posts.slice(0, 3),
    postCategories,
    videoTestimonials,
    exams,
  };
}
