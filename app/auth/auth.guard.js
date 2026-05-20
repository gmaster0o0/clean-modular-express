import AppError from '../utils/app-error';
import { statusCodes } from '../utils/status-codes';
import catchAsync from '../utils/catch-async';
/**
 * Auth Guard middleware to protect routes and ensure the user is authenticated.
 * @param {*} auth
 * @returns
 */
export const createAuthGuard = (auth) => {
  return catchAsync(async (req, res, next) => {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      throw new AppError('Unauthorized', statusCodes.UNAUTHORIZED);
    }
    req.user = session.user;
    req.session = session;
    next();
  });
};
/**
 * Restrict middleware to specific roles.
 * @param  {...any} roles
 * @returns
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      throw new AppError('Forbidden', statusCodes.FORBIDDEN);
    }
    next();
  };
};
