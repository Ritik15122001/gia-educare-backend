import { Enquiry, ENQUIRY_STATUSES } from '../models/Enquiry.js';
import { AuditLog } from '../models/AuditLog.js';
import { RESOURCES } from '../lib/resourceRegistry.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';

export const summary = asyncHandler(async (_req, res) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thirtyDaysAgo = new Date(startOfToday.getTime() - 29 * 86400000);

  const [
    totalEnquiries,
    todayEnquiries,
    weekEnquiries,
    byStatus,
    byDestination,
    trendRaw,
    recent,
    activity,
    contentCounts,
  ] = await Promise.all([
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ createdAt: { $gte: startOfToday } }),
    Enquiry.countDocuments({ createdAt: { $gte: new Date(startOfToday.getTime() - 6 * 86400000) } }),
    Enquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Enquiry.aggregate([
      { $match: { destination: { $ne: '' } } },
      { $group: { _id: '$destination', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),
    Enquiry.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Enquiry.find().sort('-createdAt').limit(6).select('name email destination status createdAt'),
    AuditLog.find({ action: { $ne: 'login' } }).sort('-createdAt').limit(8),
    Promise.all(
      RESOURCES.map(async (r) => ({
        name: r.name,
        total: await r.model.countDocuments(),
        published: await r.model.countDocuments({ published: true }),
      })),
    ),
  ]);

  const statusCounts = ENQUIRY_STATUSES.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
  byStatus.forEach(({ _id, count }) => { statusCounts[_id] = count; });

  // Fill gaps so the chart has one point per day.
  const trendMap = Object.fromEntries(trendRaw.map((d) => [d._id, d.count]));
  const trend = Array.from({ length: 30 }, (_, i) => {
    const day = new Date(thirtyDaysAgo.getTime() + i * 86400000).toISOString().slice(0, 10);
    return { date: day, count: trendMap[day] || 0 };
  });

  return ok(res, {
    enquiries: { total: totalEnquiries, today: todayEnquiries, week: weekEnquiries, byStatus: statusCounts },
    topDestinations: byDestination.map((d) => ({ destination: d._id, count: d.count })),
    trend,
    recent,
    activity,
    content: contentCounts,
  });
});
