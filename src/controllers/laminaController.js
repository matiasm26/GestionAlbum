export const laminaController = (service) => ({
  list: async (req, res, next) => { try { res.json(await service.list(Number(req.params.albumId))); } catch (e) { next(e); } },
  get: async (req, res, next) => { try { res.json(await service.get(Number(req.params.id))); } catch (e) { next(e); } },
  create: async (req, res, next) => { try { res.status(201).json(await service.create(Number(req.params.albumId), req.body)); } catch (e) { next(e); } },
  createMany: async (req, res, next) => { try { res.status(201).json(await service.createMany(Number(req.params.albumId), req.body.laminas)); } catch (e) { next(e); } },
  update: async (req, res, next) => { try { res.json(await service.update(Number(req.params.id), req.body)); } catch (e) { next(e); } },
  remove: async (req, res, next) => { try { await service.remove(Number(req.params.id)); res.status(204).send(); } catch (e) { next(e); } },
  missing: async (req, res, next) => { try { res.json(await service.missing(Number(req.params.albumId))); } catch (e) { next(e); } },
  repeated: async (req, res, next) => { try { res.json(await service.repeated(Number(req.params.albumId))); } catch (e) { next(e); } }
});
