import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { toJSONPlugin } from './plugins.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 120 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i, 'Enter a valid email'],
    },
    password: { type: String, required: true, minlength: 8, select: false, private: true },
    // A Role `key` (see models/Role.js). Validated against the roles collection by the controller.
    role: { type: String, default: 'editor', trim: true, index: true },
    active: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    refreshTokenHash: { type: String, select: false, private: true },
  },
  { timestamps: true },
);

userSchema.plugin(toJSONPlugin);

// Async hooks resolve by returning — mongoose does not pass `next` to them.
userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(plain) {
  return bcrypt.compare(plain, this.password);
};

export const User = mongoose.model('User', userSchema);
