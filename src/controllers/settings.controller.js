import { SiteSetting } from '../models/SiteSetting.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';
import { recordAudit } from '../models/AuditLog.js';

export const get = asyncHandler(async (_req, res) => ok(res, await SiteSetting.getSingleton()));

export const update = asyncHandler(async (req, res) => {
  const settings = await SiteSetting.getSingleton();
  Object.assign(settings, req.body);
  await settings.save();
  await recordAudit({ req, action: 'update', resource: 'settings', summary: 'Updated site settings' });
  return ok(res, settings);
});
