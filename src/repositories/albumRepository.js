export class AlbumRepository {
  constructor(prisma) { this.prisma = prisma; }
  findAll() { return this.prisma.album.findMany({ include: { laminas: true }, orderBy: { id: 'asc' } }); }
  findById(id) { return this.prisma.album.findUnique({ where: { id }, include: { laminas: true } }); }
  create(data) { return this.prisma.album.create({ data }); }
  update(id, data) { return this.prisma.album.update({ where: { id }, data }); }
  delete(id) { return this.prisma.album.delete({ where: { id } }); }
}
