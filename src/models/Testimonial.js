import mongoose from 'mongoose';
import { toJSONPlugin, contentPlugin } from './plugins.js';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Student name is required'], trim: true },
    initials: { type: String, trim: true, maxlength: 3 },
    program: { type: String, default: '', trim: true },
    quote: { type: String, required: [true, 'Quote is required'], trim: true, maxlength: 800 },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    avatarUrl: { type: String, default: '', trim: true },
  },
  { timestamps: true },
);

testimonialSchema.plugin(toJSONPlugin);
testimonialSchema.plugin(contentPlugin);

// Fall back to deriving initials from the name.
testimonialSchema.pre('save', function setInitials() {
  // Mongoose 8 resolves hooks by return, not by calling next().
  if (!this.initials && this.name) {
    this.initials = this.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  }
});

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
