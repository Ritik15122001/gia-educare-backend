import mongoose from 'mongoose';
import { toJSONPlugin, contentPlugin } from './plugins.js';

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    initials: { type: String, trim: true, maxlength: 3 },
    role: { type: String, default: '', trim: true },
    bio: { type: String, default: '', trim: true, maxlength: 600 },
    photoUrl: { type: String, default: '', trim: true },
    linkedin: { type: String, default: '', trim: true },
  },
  { timestamps: true },
);

teamMemberSchema.plugin(toJSONPlugin);
teamMemberSchema.plugin(contentPlugin);

teamMemberSchema.pre('save', function setInitials() {
  // Mongoose 8 resolves hooks by return, not by calling next().
  if (!this.initials && this.name) {
    this.initials = this.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  }
});

export const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
