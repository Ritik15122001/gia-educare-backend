import { Enquiry, ENQUIRY_STATUSES, BUDGET_RANGES } from '../models/Enquiry.js';
import { AuditLog } from '../models/AuditLog.js';
import { RESOURCES } from '../lib/resourceRegistry.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';
import { leadScopeFilter, hasPermission } from '../services/access.service.js';

export const summary = asyncHandler(async (req, res) => {
  // Lead figures cover only the enquiries this user may see; activity and content
  // counts are for roles that manage the site.
  const scope = leadScopeFilter(req);
  const match = (extra = {}) => (Object.keys(scope).length ? { $and: [scope, extra] } : extra);
  const canSeeActivity = hasPermission(req.access, 'settings.view', 'settings.edit');
  const canSeeContent = RESOURCES.some((r) => hasPermission(req.access, `${r.name}.view`, `${r.name}.edit`));

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
    byBudget,
    topReferrals,
  ] = await Promise.all([
    Enquiry.countDocuments(match()),
    Enquiry.countDocuments(match({ createdAt: { $gte: startOfToday } })),
    Enquiry.countDocuments(match({ createdAt: { $gte: new Date(startOfToday.getTime() - 6 * 86400000) } })),
    Enquiry.aggregate([{ $match: match() }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Enquiry.aggregate([
      { $match: match({ destination: { $ne: '' } }) },
      { $group: { _id: '$destination', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),
    Enquiry.aggregate([
      { $match: match({ createdAt: { $gte: thirtyDaysAgo } }) },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Enquiry.find(match()).sort('-createdAt').limit(6).select('name email destination status createdAt'),
    canSeeActivity ? AuditLog.find({ action: { $ne: 'login' } }).sort('-createdAt').limit(8) : null,
    canSeeContent
      ? Promise.all(
        RESOURCES.map(async (r) => ({
          name: r.name,
          total: await r.model.countDocuments(),
          published: await r.model.countDocuments({ published: true }),
        })),
      )
      : null,
    Enquiry.aggregate([
      { $match: match({ budget: { $ne: '' } }) },
      { $group: { _id: '$budget', count: { $sum: 1 } } },
    ]),
    Enquiry.aggregate([
      { $match: match({ referral: { $nin: ['', null] } }) },
      { $group: { _id: '$referral', count: { $sum: 1 }, converted: { $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] } } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),
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
    leadScope: hasPermission(req.access, 'leads.view') ? req.access.leadScope : null,
    enquiries: { total: totalEnquiries, today: todayEnquiries, week: weekEnquiries, byStatus: statusCounts },
    topDestinations: byDestination.map((d) => ({ destination: d._id, count: d.count })),
    trend,
    recent,
    activity,
    content: contentCounts,
    // Every range, in ladder order, including the empty ones.
    budgets: BUDGET_RANGES.map((range) => ({ range, count: byBudget.find((b) => b._id === range)?.count || 0 })),
    topReferrals: topReferrals.map((r) => ({ referral: r._id, count: r.count, converted: r.converted })),
  });
});
