export class LaminaRepository {
  constructor(prisma) { this.prisma = prisma; }
  findAllByAlbum(albumId) { return this.prisma.lamina.findMany({ where: { albumId }, orderBy: { numero: 'asc' } }); }
  findById(id) { return this.prisma.lamina.findUnique({ where: { id } }); }
  create(albumId, data) { return this.prisma.lamina.create({ data: { ...data, albumId } }); }
  createMany(albumId, laminas) { return this.prisma.lamina.createMany({ data: laminas.map(l => ({ ...l, albumId })) }); }
  update(id, data) { return this.prisma.lamina.update({ where: { id }, data }); }
  delete(id) { return this.prisma.lamina.delete({ where: { id } }); }
  missing(albumId) { return this.prisma.lamina.findMany({ where: { albumId, cantidad: 0 }, orderBy: { numero: 'asc' } }); }
  repeated(albumId) { return this.prisma.lamina.findMany({ where: { albumId, cantidad: { gt: 1 } }, orderBy: { numero: 'asc' } }); }
}
