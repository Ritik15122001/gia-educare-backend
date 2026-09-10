import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created, noContent } from '../utils/apiResponse.js';
import { parseListQuery, buildMeta } from '../utils/pagination.js';
import { recordAudit } from '../models/AuditLog.js';

/**
 * Builds a full set of REST handlers for a mongoose model.
 * Every content collection in this API is orderable and publishable, so the
 * behaviour is identical apart from the fields — which is exactly what a
 * factory is for.
 *
 * @param {import('mongoose').Model} Model
 * @param {object} options
 * @param {string} options.resource      label used in audit entries
 * @param {string[]} options.searchable  fields matched by ?search=
 * @param {string} options.defaultSort
 * @param {(doc) => string} options.labelOf  human summary for the audit log
 */
export function createCrudController(Model, options = {}) {
  const {
    resource = Model.modelName.toLowerCase(),
    searchable = ['title', 'name'],
    defaultSort = 'order createdAt',
    labelOf = (doc) => doc?.title || doc?.name || doc?.question || doc?.key || String(doc?._id || ''),
  } = options;

  const buildFilter = (query) => {
    const filter = {};

    if (query.search) {
      const rx = new RegExp(query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = searchable.map((field) => ({ [field]: rx }));
    }
    if (query.published === 'true') filter.published = true;
    if (query.published === 'false') filter.published = false;
    if (query.category) filter.category = query.category;
    if (query.showOnHome === 'true') filter.showOnHome = true;

    return filter;
  };

  return {
    list: asyncHandler(async (req, res) => {
      const { page, limit, skip, sort } = parseListQuery(req.query, { defaultSort });
      const filter = buildFilter(req.query);

      const [items, total] = await Promise.all([
        Model.find(filter).sort(sort).skip(skip).limit(limit),
        Model.countDocuments(filter),
      ]);

      return ok(res, items, buildMeta({ page, limit, total }));
    }),

    get: asyncHandler(async (req, res) => {
      const doc = await Model.findById(req.params.id);
      if (!doc) throw ApiError.notFound(`${Model.modelName} not found`);
      return ok(res, doc);
    }),

    create: asyncHandler(async (req, res) => {
      // New rows land at the end of the list unless told otherwise.
      if (req.body.order === undefined) {
        const last = await Model.findOne().sort('-order').select('order');
        req.body.order = (last?.order ?? -1) + 1;
      }

      const doc = await Model.create(req.body);
      await recordAudit({ req, action: 'create', resource, resourceId: doc.id, summary: `Created “${labelOf(doc)}”` });
      return created(res, doc);
    }),

    update: asyncHandler(async (req, res) => {
      const doc = await Model.findById(req.params.id);
      if (!doc) throw ApiError.notFound(`${Model.modelName} not found`);

      Object.assign(doc, req.body);
      await doc.save();
      await recordAudit({ req, action: 'update', resource, resourceId: doc.id, summary: `Updated “${labelOf(doc)}”` });
      return ok(res, doc);
    }),

    remove: asyncHandler(async (req, res) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) throw ApiError.notFound(`${Model.modelName} not found`);
      await recordAudit({ req, action: 'delete', resource, resourceId: doc.id, summary: `Deleted “${labelOf(doc)}”` });
      return noContent(res);
    }),

    // Flip published without sending the whole document back.
    togglePublish: asyncHandler(async (req, res) => {
      const doc = await Model.findById(req.params.id);
      if (!doc) throw ApiError.notFound(`${Model.modelName} not found`);
      doc.published = !doc.published;
      await doc.save();
      await recordAudit({
        req,
        action: 'update',
        resource,
        resourceId: doc.id,
        summary: `${doc.published ? 'Published' : 'Unpublished'} “${labelOf(doc)}”`,
      });
      return ok(res, doc);
    }),

    // Accepts [{ id, order }] so the admin can drag rows into place.
    reorder: asyncHandler(async (req, res) => {
      const { items } = req.body;
      await Model.bulkWrite(
        items.map(({ id, order }) => ({ updateOne: { filter: { _id: id }, update: { $set: { order } } } })),
      );
      await recordAudit({ req, action: 'reorder', resource, summary: `Reordered ${items.length} item(s)` });
      const docs = await Model.find({ _id: { $in: items.map((i) => i.id) } }).sort(defaultSort);
      return ok(res, docs);
    }),
  };
}
