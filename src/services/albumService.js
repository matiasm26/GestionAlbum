import { AppError } from '../middlewares/errorHandler.js';
export class AlbumService {
  constructor(albumRepo, auditRepo) { this.albumRepo = albumRepo; this.auditRepo = auditRepo; }
  list() { return this.albumRepo.findAll(); }
  async get(id) { const item = await this.albumRepo.findById(id); if (!item) throw new AppError(404, 'Álbum no encontrado'); return item; }
  async create(data) { const item = await this.albumRepo.create(data); await this.auditRepo.create({ accion: 'CREACION', entidad: 'Album', entidadId: item.id, albumId: item.id, datos: JSON.parse(JSON.stringify(item)) }); return item; }
  async update(id, data) { await this.get(id); const item = await this.albumRepo.update(id, data); await this.auditRepo.create({ accion: 'ACTUALIZACION', entidad: 'Album', entidadId: id, albumId: id, datos: data }); return item; }
  async remove(id) { await this.get(id); const item = await this.albumRepo.delete(id); await this.auditRepo.create({ accion: 'ELIMINACION', entidad: 'Album', entidadId: id, datos: { nombre: item.nombre } }); return item; }
}
