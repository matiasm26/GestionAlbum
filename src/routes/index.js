import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { albumCreateSchema, albumUpdateSchema, laminaCreateSchema, laminaUpdateSchema, bulkLaminaSchema, idParamsSchema, albumIdParamsSchema } from '../validators/schemas.js';

export function buildRoutes(albumCtrl, laminaCtrl) {
  const router = Router();
  router.get('/albums', albumCtrl.list);
  router.post('/albums', validate(albumCreateSchema), albumCtrl.create);
  router.get('/albums/:id', validate(idParamsSchema, 'params'), albumCtrl.get);
  router.patch('/albums/:id', validate(idParamsSchema, 'params'), validate(albumUpdateSchema), albumCtrl.update);
  router.delete('/albums/:id', validate(idParamsSchema, 'params'), albumCtrl.remove);

  router.get('/albums/:albumId/laminas', validate(albumIdParamsSchema, 'params'), laminaCtrl.list);
  router.post('/albums/:albumId/laminas', validate(albumIdParamsSchema, 'params'), validate(laminaCreateSchema), laminaCtrl.create);
  router.post('/albums/:albumId/laminas/bulk', validate(albumIdParamsSchema, 'params'), validate(bulkLaminaSchema), laminaCtrl.createMany);
  router.get('/albums/:albumId/laminas/missing', validate(albumIdParamsSchema, 'params'), laminaCtrl.missing);
  router.get('/albums/:albumId/laminas/repeated', validate(albumIdParamsSchema, 'params'), laminaCtrl.repeated);
  router.get('/laminas/:id', validate(idParamsSchema, 'params'), laminaCtrl.get);
  router.patch('/laminas/:id', validate(idParamsSchema, 'params'), validate(laminaUpdateSchema), laminaCtrl.update);
  router.delete('/laminas/:id', validate(idParamsSchema, 'params'), laminaCtrl.remove);
  return router;
}
