import { z } from 'zod';

const optionalText = z.string().trim().max(500).nullable().optional();
export const albumCreateSchema = z.object({ nombre: z.string().trim().min(1).max(150), descripcion: optionalText, anio: z.number().int().min(1800).max(2200).nullable().optional() }).strict();
export const albumUpdateSchema = albumCreateSchema.partial().refine(v => Object.keys(v).length > 0, 'Debe enviar al menos un campo');
export const laminaCreateSchema = z.object({ numero: z.number().int().positive(), nombre: z.string().trim().min(1).max(150), cantidad: z.number().int().min(0).default(0), imagenUrl: z.string().url().max(1000).nullable().optional() }).strict();
export const laminaUpdateSchema = laminaCreateSchema.partial().refine(v => Object.keys(v).length > 0, 'Debe enviar al menos un campo');
export const bulkLaminaSchema = z.object({ laminas: z.array(laminaCreateSchema).min(1).max(1000) }).strict();
export const idParamsSchema = z.object({ id: z.coerce.number().int().positive() });
export const albumIdParamsSchema = z.object({ albumId: z.coerce.number().int().positive() });
