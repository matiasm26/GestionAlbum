export class AuditRepository {
  constructor(prisma) { this.prisma = prisma; }
  create(data) { return this.prisma.auditLog.create({ data }); }
}
