import { Router } from 'express';
import { RESOURCES } from '../../lib/resourceRegistry.js';
import { createCrudController } from '../../controllers/crud.factory.js';
import { validate } from '../../middleware/validate.js';
import { requirePermission } from '../../middleware/auth.js';
import { idParamSchema, reorderSchema, listQuerySchema } from '../../validators/common.validators.js';

const router = Router();

// Turn the registry into a conventional REST surface per resource:
//   GET    /:resource            list (page, limit, sort, search, published)
//   POST   /:resource            create
//   PATCH  /:resource/reorder    bulk order update
//   GET    /:resource/:id        read one
//   PATCH  /:resource/:id        update
//   PATCH  /:resource/:id/publish  toggle published
//   DELETE /:resource/:id        delete
RESOURCES.forEach((resource) => {
  const { name, model, schema, searchable, beforeWrite } = resource;
  const ctrl = createCrudController(model, { resource: name, searchable });
  const sub = Router();

  // Derive slugs and other computed fields before validation runs.
  const prepare = (req, _res, next) => {
    if (beforeWrite && req.body && typeof req.body === 'object') {
      req.body = beforeWrite(req.body, { isCreate: req.method === 'POST' });
    }
    next();
  };

  sub.use(requirePermission('content.manage'));

  sub.route('/')
    .get(validate(listQuerySchema, 'query'), ctrl.list)
    .post(prepare, validate(schema), ctrl.create);

  sub.patch('/reorder', validate(reorderSchema), ctrl.reorder);

  sub.route('/:id')
    .get(validate(idParamSchema, 'params'), ctrl.get)
    .patch(validate(idParamSchema, 'params'), prepare, validate(schema.partial()), ctrl.update)
    .delete(validate(idParamSchema, 'params'), ctrl.remove);

  sub.patch('/:id/publish', validate(idParamSchema, 'params'), ctrl.togglePublish);

  router.use(`/${name}`, sub);
});

export default router;
