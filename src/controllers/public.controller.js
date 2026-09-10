import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { getSiteContent } from '../services/content.service.js';
import { getResource } from '../lib/resourceRegistry.js';
import { SiteSetting } from '../models/SiteSetting.js';

export const getContent = asyncHandler(async (_req, res) => ok(res, await getSiteContent()));

export const getSettings = asyncHandler(async (_req, res) => ok(res, await SiteSetting.getSingleton()));

// GET /public/:resource — published rows of any registered collection.
export const listResource = asyncHandler(async (req, res) => {
  const resource = getResource(req.params.resource);
  if (!resource) throw ApiError.notFound(`Unknown collection: ${req.params.resource}`);

  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.showOnHome === 'true') filter.showOnHome = true;

  const items = await resource.model.findPublished(filter);
  return ok(res, items);
});
