import AppError from '../utils/app-error.js';

const validate =
  (schema, target = 'body') =>
  (req, res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      throw new AppError(400, 'Validation Error', result.error.errors);
    }

    req[target] = result.data;

    next();
  };

export default validate;
