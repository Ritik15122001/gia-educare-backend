import mongoose from 'mongoose';
import { toJSONPlugin, contentPlugin } from './plugins.js';

// Blog sections such as "Beginner Doubts" and "Finances". A post points at one
// by `key`, the same way a course points at a course category.
const postCategorySchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, lowercase: true, trim: true },
    label: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true, maxlength: 300 },
    // Promote the category to its own dropdown in the website's main navigation.
    showInNav: { type: Boolean, default: false },
  },
  { timestamps: true },
);

postCategorySchema.plugin(toJSONPlugin);
postCategorySchema.plugin(contentPlugin);

export const PostCategory = mongoose.model('PostCategory', postCategorySchema);
