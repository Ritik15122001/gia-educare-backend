// Shared mongoose plugins so every collection behaves the same way on the wire.

// _id -> id, drop __v and any hidden fields.
export function toJSONPlugin(schema) {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform(_doc, ret) {
      ret.id = ret._id?.toString();
      delete ret._id;
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options?.private) delete ret[path];
      });
      return ret;
    },
  });
}

// Every piece of editable content is orderable and can be hidden from the site
// without deleting it.
export function contentPlugin(schema) {
  schema.add({
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true, index: true },
  });

  schema.statics.findPublished = function findPublished(filter = {}) {
    return this.find({ ...filter, published: true }).sort({ order: 1, createdAt: 1 });
  };
}
