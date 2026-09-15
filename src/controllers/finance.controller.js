import {
  FinanceEntry, PL_TAGS, PAYMENT_MODES, CATEGORY_PRESETS, SUGGESTED_TAGS, tagsForType,
} from '../models/FinanceEntry.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created, noContent } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { parseListQuery, buildMeta } from '../utils/pagination.js';
import { recordAudit } from '../models/AuditLog.js';

// Finance is deliberately NOT a registry resource: registry collections are
// served publicly through /public/:resource.

const DAY_RX = /^\d{4}-\d{2}-\d{2}$/;
const toDay = (v) => new Date(`${v}T00:00:00.000Z`);
const endOfDay = (v) => new Date(`${v}T23:59:59.999Z`);
const escapeRx = (v) => v.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const rupees = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

function dateRange(query) {
  const range = {};
  if (DAY_RX.test(query.from || '')) range.$gte = toDay(query.from);
  if (DAY_RX.test(query.to || '')) range.$lte = endOfDay(query.to);
  return Object.keys(range).length ? { date: range } : {};
}

function buildFilter(query) {
  const filter = { ...dateRange(query) };
  if (query.type) filter.type = query.type;
  if (query.plTag) filter.plTag = query.plTag;
  if (query.category) filter.category = query.category;
  if (query.search?.trim()) {
    const rx = new RegExp(escapeRx(query.search), 'i');
    filter.$or = [{ description: rx }, { party: rx }, { reference: rx }, { category: rx }];
  }
  return filter;
}

const assertTagFits = (type, plTag) => {
  if (!tagsForType(type).includes(plTag)) {
    const label = PL_TAGS.find((t) => t.key === plTag)?.label || plTag;
    throw ApiError.badRequest(`"${label}" cannot be used on an ${type} entry`);
  }
};

async function totalsFor(match) {
  const rows = await FinanceEntry.aggregate([
    { $match: match },
    { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]);
  const income = round2(rows.find((r) => r._id === 'income')?.total || 0);
  const expense = round2(rows.find((r) => r._id === 'expense')?.total || 0);
  return { income, expense, net: round2(income - expense) };
}

// Everything the entry form needs: P&L heads with their guidance, payment modes,
// and category suggestions (presets plus anything already used).
export const options = asyncHandler(async (_req, res) => {
  const used = await FinanceEntry.aggregate([{ $group: { _id: { type: '$type', category: '$category' } } }]);
  const categories = Object.fromEntries(Object.entries(CATEGORY_PRESETS).map(([type, presets]) => {
    const seen = used.filter((u) => u._id.type === type).map((u) => u._id.category);
    return [type, [...new Set([...presets, ...seen])].sort((a, b) => a.localeCompare(b))];
  }));
  return ok(res, { plTags: PL_TAGS, paymentModes: PAYMENT_MODES, categories, suggestedTags: SUGGESTED_TAGS });
});

export const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parseListQuery(req.query, { defaultSort: '-date' });
  const sortKey = ['date', '-date', 'amount', '-amount'].includes(req.query.sort) ? req.query.sort : '-date';
  const sort = { [sortKey.replace('-', '')]: sortKey.startsWith('-') ? -1 : 1, createdAt: -1 };
  const filter = buildFilter(req.query);

  const [items, total, totals] = await Promise.all([
    FinanceEntry.find(filter).sort(sort).skip(skip).limit(limit),
    FinanceEntry.countDocuments(filter),
    totalsFor(filter),
  ]);
  return ok(res, items, { ...buildMeta({ page, limit, total }), totals });
});

export const get = asyncHandler(async (req, res) => {
  const doc = await FinanceEntry.findById(req.params.id);
  if (!doc) throw ApiError.notFound('Entry not found');
  return ok(res, doc);
});

export const create = asyncHandler(async (req, res) => {
  const { date, ...rest } = req.body;
  assertTagFits(rest.type, rest.plTag);
  const doc = await FinanceEntry.create({
    ...rest,
    date: toDay(date),
    createdBy: req.user._id,
    createdByName: req.user.name,
  });
  await recordAudit({ req, action: 'create', resource: 'finance', resourceId: doc.id, summary: `Added ${doc.type} ${rupees(doc.amount)} · ${doc.category}` });
  return created(res, doc);
});

export const update = asyncHandler(async (req, res) => {
  const doc = await FinanceEntry.findById(req.params.id);
  if (!doc) throw ApiError.notFound('Entry not found');

  const { date, ...rest } = req.body;
  Object.assign(doc, rest);
  if (date) doc.date = toDay(date);
  assertTagFits(doc.type, doc.plTag);
  doc.updatedByName = req.user.name;
  await doc.save();

  await recordAudit({ req, action: 'update', resource: 'finance', resourceId: doc.id, summary: `Edited ${doc.type} ${rupees(doc.amount)} · ${doc.category}` });
  return ok(res, doc);
});

export const remove = asyncHandler(async (req, res) => {
  const doc = await FinanceEntry.findById(req.params.id);
  if (!doc) throw ApiError.notFound('Entry not found');
  await doc.deleteOne();
  await recordAudit({ req, action: 'delete', resource: 'finance', resourceId: doc.id, summary: `Deleted ${doc.type} ${rupees(doc.amount)} · ${doc.category}` });
  return noContent(res);
});

/**
 * The P&L statement for a date range, built from the manual tags:
 * each head with its categories, the three profit lines, and a month-by-month series.
 */
export const summary = asyncHandler(async (req, res) => {
  const match = dateRange(req.query);

  const [byTag, byMonth] = await Promise.all([
    FinanceEntry.aggregate([
      { $match: match },
      { $group: { _id: { plTag: '$plTag', category: '$category' }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]),
    FinanceEntry.aggregate([
      { $match: { ...match, plTag: { $ne: 'excluded' } } },
      {
        $group: {
          _id: { month: { $dateToString: { format: '%Y-%m', date: '$date' } }, type: '$type' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]),
  ]);

  const heads = PL_TAGS.map((tag) => {
    const rows = byTag.filter((r) => r._id.plTag === tag.key);
    return {
      key: tag.key,
      label: tag.label,
      type: tag.type,
      total: round2(rows.reduce((n, r) => n + r.total, 0)),
      count: rows.reduce((n, r) => n + r.count, 0),
      categories: rows.map((r) => ({ category: r._id.category, total: round2(r.total), count: r.count })),
    };
  });
  const head = (key) => heads.find((h) => h.key === key).total;

  const revenue = head('revenue');
  const grossProfit = round2(revenue - head('direct_cost'));
  const operatingProfit = round2(grossProfit - head('operating_expense'));
  const netProfit = round2(operatingProfit + head('other_income') - head('other_expense'));
  const pct = (v) => (revenue ? Math.round((v / revenue) * 1000) / 10 : null);

  const months = [...new Set(byMonth.map((r) => r._id.month))].map((month) => {
    const pick = (type) => round2(byMonth.find((r) => r._id.month === month && r._id.type === type)?.total || 0);
    const income = pick('income');
    const expense = pick('expense');
    return { month, income, expense, net: round2(income - expense) };
  });

  return ok(res, {
    range: { from: req.query.from || null, to: req.query.to || null },
    heads,
    totals: {
      revenue,
      totalIncome: round2(revenue + head('other_income')),
      totalExpense: round2(head('direct_cost') + head('operating_expense') + head('other_expense')),
      excluded: head('excluded'),
      grossProfit,
      operatingProfit,
      netProfit,
      grossMargin: pct(grossProfit),
      netMargin: pct(netProfit),
    },
    months,
  });
});

export const exportCsv = asyncHandler(async (req, res) => {
  const rows = await FinanceEntry.find(buildFilter(req.query)).sort({ date: 1, createdAt: 1 }).limit(20000);
  const tagLabel = Object.fromEntries(PL_TAGS.map((t) => [t.key, t.label]));

  const quote = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  // Free-text cells: neutralise anything a spreadsheet would evaluate as a formula.
  const text = (v) => {
    const s = String(v ?? '');
    return quote(/^[=+\-@\t\r]/.test(s) ? `'${s}` : s);
  };
  const headers = ['Date', 'Type', 'P&L tag', 'Category', 'Amount (INR)', 'Signed amount (INR)', 'Party', 'Payment mode', 'Reference', 'Description', 'Added by'];
  const csv = [
    headers.join(','),
    ...rows.map((r) => [
      quote(r.date.toISOString().slice(0, 10)),
      quote(r.type),
      quote(tagLabel[r.plTag] || r.plTag),
      text(r.category),
      quote(r.amount.toFixed(2)),
      quote((r.type === 'expense' ? -r.amount : r.amount).toFixed(2)),
      text(r.party),
      quote(r.paymentMode.replace('_', ' ')),
      text(r.reference),
      text(r.description),
      text(r.createdByName),
    ].join(',')),
  ].join('\n');

  res.header('Content-Type', 'text/csv; charset=utf-8');
  res.attachment(`gia-finance-${new Date().toISOString().slice(0, 10)}.csv`);
  // BOM so Excel reads the ₹-free but UTF-8 text (party names, descriptions) correctly.
  return res.send(`﻿${csv}`);
});
