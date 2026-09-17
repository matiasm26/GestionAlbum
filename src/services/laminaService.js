import { AppError } from '../middlewares/errorHandler.js';
export class LaminaService {
  constructor(laminaRepo, albumRepo, auditRepo) { this.laminaRepo = laminaRepo; this.albumRepo = albumRepo; this.auditRepo = auditRepo; }
  async ensureAlbum(albumId) { if (!await this.albumRepo.findById(albumId)) throw new AppError(404, 'Álbum no encontrado'); }
  async get(id) { const item = await this.laminaRepo.findById(id); if (!item) throw new AppError(404, 'Lámina no encontrada'); return item; }
  async list(albumId) { await this.ensureAlbum(albumId); return this.laminaRepo.findAllByAlbum(albumId); }
  async create(albumId, data) { await this.ensureAlbum(albumId); const item = await this.laminaRepo.create(albumId, data); await this.auditRepo.create({ accion: 'CREACION', entidad: 'Lamina', entidadId: item.id, albumId, laminaId: item.id, datos: JSON.parse(JSON.stringify(item)) }); return item; }
  async createMany(albumId, laminas) { await this.ensureAlbum(albumId); const result = await this.laminaRepo.createMany(albumId, laminas); await this.auditRepo.create({ accion: 'CREACION', entidad: 'Lamina', entidadId: 0, albumId, datos: { cantidad: result.count } }); return { count: result.count }; }
  async update(id, data) { const current = await this.get(id); const item = await this.laminaRepo.update(id, data); await this.auditRepo.create({ accion: 'ACTUALIZACION', entidad: 'Lamina', entidadId: id, albumId: current.albumId, laminaId: id, datos: data }); return item; }
  async remove(id) { const current = await this.get(id); const item = await this.laminaRepo.delete(id); await this.auditRepo.create({ accion: 'ELIMINACION', entidad: 'Lamina', entidadId: id, albumId: current.albumId, datos: { numero: item.numero } }); return item; }
  async missing(albumId) { await this.ensureAlbum(albumId); return this.laminaRepo.missing(albumId); }
  async repeated(albumId) { await this.ensureAlbum(albumId); return this.laminaRepo.repeated(albumId); }
}
