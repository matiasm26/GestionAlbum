import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const album = await prisma.album.upsert({
    where: { id: 1 },
    update: {},
    create: { nombre: 'Mundial 2026', descripcion: 'Álbum de prueba', anio: 2026 }
  });
  await prisma.lamina.createMany({
    data: [
      { albumId: album.id, numero: 1, nombre: 'Portada', cantidad: 1 },
      { albumId: album.id, numero: 2, nombre: 'Estadio', cantidad: 0 },
      { albumId: album.id, numero: 3, nombre: 'Jugador estrella', cantidad: 2 }
    ], skipDuplicates: true
  });
}

main().finally(() => prisma.$disconnect());
