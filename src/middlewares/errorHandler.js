export class AppError extends Error {
  constructor(status, message, details) { super(message); this.status = status; this.details = details; }
}
export function notFound(req, res) { res.status(404).json({ error: 'Ruta no encontrada' }); }
export function errorHandler(err, req, res, next) {
  if (!err.status || err.status >= 500) console.error(err);
  if (err?.code === 'P2002') return res.status(409).json({ error: 'Ya existe un registro con esos datos' });
  if (err?.code === 'P2025') return res.status(404).json({ error: 'Registro no encontrado' });
  const status = err.status || 500;
  res.status(status).json({ error: status === 500 ? 'Error interno del servidor' : err.message, ...(err.details ? { details: err.details } : {}) });
}
