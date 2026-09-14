import mongoose from 'mongoose';
import { toJSONPlugin, contentPlugin } from './plugins.js';

/**
 * Pulls a YouTube video id out of the URL shapes editors paste in practice:
 * watch?v=, youtu.be/, /shorts/, /embed/ and /live/. Returns '' when the
 * URL is not a YouTube link.
 */
export function youtubeIdOf(url = '') {
  const value = String(url).trim();
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube(?:-nocookie)?\.com\/(?:embed|shorts|live|v)\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/watch\?(?:.*&)?v=([A-Za-z0-9_-]{11})/,
  ];
  for (const rx of patterns) {
    const match = value.match(rx);
    if (match) return match[1];
  }
  return '';
}

const videoTestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Student name is required'], trim: true },
    program: { type: String, default: '', trim: true },
    university: { type: String, default: '', trim: true },
    country: { type: String, default: '', trim: true },
    // A YouTube link, or a direct .mp4/.webm file (e.g. from the media library).
    videoUrl: { type: String, required: [true, 'Video link is required'], trim: true },
    thumbnailUrl: { type: String, default: '', trim: true },
    quote: { type: String, default: '', trim: true, maxlength: 300 },
  },
  { timestamps: true },
);

videoTestimonialSchema.plugin(toJSONPlugin);
videoTestimonialSchema.plugin(contentPlugin);

// Derived, so the website never has to parse URLs itself.
videoTestimonialSchema.virtual('youtubeId').get(function youtubeId() {
  return youtubeIdOf(this.videoUrl);
});
videoTestimonialSchema.virtual('poster').get(function poster() {
  if (this.thumbnailUrl) return this.thumbnailUrl;
  const id = youtubeIdOf(this.videoUrl);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '';
});

export const VideoTestimonial = mongoose.model('VideoTestimonial', videoTestimonialSchema);
