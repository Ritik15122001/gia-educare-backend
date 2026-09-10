export function parseListQuery(query = {}, { defaultSort = 'order createdAt', maxLimit = 100 } = {}) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, Number.parseInt(query.limit, 10) || 20));
  const sort = (query.sort || defaultSort).split(',').join(' ');
  return { page, limit, skip: (page - 1) * limit, sort };
}

export function buildMeta({ page, limit, total }) {
  return { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) };
}
