import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins.js';

// A light paper trail of who changed what in the admin panel.
const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, trim: true },
    action: { type: String, required: true, enum: ['create', 'update', 'delete', 'login', 'reorder'] },
    resource: { type: String, required: true, trim: true },
    resourceId: { type: String, trim: true },
    summary: { type: String, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

auditLogSchema.plugin(toJSONPlugin);
auditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export async function recordAudit({ req, action, resource, resourceId, summary }) {
  try {
    await AuditLog.create({
      user: req?.user?.id,
      userName: req?.user?.name,
      action,
      resource,
      resourceId: resourceId ? String(resourceId) : undefined,
      summary,
    });
  } catch {
    // Auditing must never break the request it is describing.
  }
}
