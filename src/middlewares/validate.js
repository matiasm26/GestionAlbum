import { AppError } from './errorHandler.js';
export const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) return next(new AppError(400, 'Datos inválidos', result.error.issues));
  req[source] = result.data; next();
};
