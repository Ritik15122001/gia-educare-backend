import mongoose from 'mongoose';
import { toJSONPlugin, contentPlugin } from './plugins.js';

const postSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    title: { type: String, required: [true, 'Title is required'], trim: true },
    excerpt: { type: String, default: '', trim: true, maxlength: 400 },
    // Markdown. Rendered on the website by utils/markdown.jsx — see that file
    // for the subset that is supported.
    body: { type: String, default: '', trim: true, maxlength: 40000 },
    coverUrl: { type: String, default: '', trim: true },
    author: { type: String, default: '', trim: true },
    tags: { type: [String], default: [], index: true },
    // PostCategory.key — drives the blog filter and the category nav dropdowns.
    category: { type: String, default: '', lowercase: true, trim: true, index: true },
    // Destination.slug — ties the article to a country menu and detail page.
    destination: { type: String, default: '', lowercase: true, trim: true, index: true },
    publishedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

postSchema.plugin(toJSONPlugin);
postSchema.plugin(contentPlugin);
postSchema.index({ title: 'text', excerpt: 'text', body: 'text' });

// Reading time is derived, never stored — a virtual stays correct no matter how
// the row was written. The seed upserts with updateOne(), which bypasses
// document middleware, so a pre('save') hook would silently leave it at 0.
postSchema.virtual('readMinutes').get(function readMinutes() {
  const words = (this.body || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
});

// Posts read newest-first everywhere, unlike the order-dragged collections.
// Overriding the contentPlugin static keeps /public/posts and the aggregated
// /public/content payload consistent with each other.
postSchema.statics.findPublished = function findPublished(filter = {}) {
  return this.find({ ...filter, published: true }).sort({ publishedAt: -1, createdAt: -1 });
};

export const Post = mongoose.model('Post', postSchema);
