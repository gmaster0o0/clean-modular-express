import { describe, it, expect, beforeEach, vi } from 'vitest';
import { sampleUsers, sampleSessions } from '../../test/testdata/auth.testdata.js';
import { statusCodes } from '../utils/status-codes.js';
import { createMockReq, createMockRes, createMockNext } from '../../test/mocks/http.mock.js';
import { createAuthGuard, restrictTo } from './auth.guard.js';
import AppError from '../utils/app-error.js';

const getThrownError = (fn) => {
  try {
    fn();
  } catch (error) {
    return error;
  }
  throw new Error('Expected function to throw');
};

describe('Auth Guard', () => {
  let req;
  let res;
  let next;
  let mockAuth;

  beforeEach(() => {
    req = createMockReq();
    res = createMockRes();
    next = createMockNext();
    mockAuth = {
      api: {
        getSession: vi.fn(),
      },
    };
  });

  describe('createAuthGuard', () => {
    it('should successfully authenticate user with valid session', async () => {
      const session = sampleSessions[0];
      mockAuth.api.getSession.mockResolvedValue(session);
      const authGuard = createAuthGuard(mockAuth);

      await authGuard(req, res, next);

      expect(mockAuth.api.getSession).toHaveBeenCalledWith({ headers: req.headers });
      expect(req.user).toEqual(session.user);
      expect(req.session).toEqual(session);
      expect(next).toHaveBeenCalled();
    });

    it('should pass Unauthorized error to next when session is null', async () => {
      mockAuth.api.getSession.mockResolvedValue(null);
      const authGuard = createAuthGuard(mockAuth);

      await authGuard(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = next.mock.calls[0][0];
      expect(error.message).toBe('Unauthorized');
      expect(error.statusCode).toBe(statusCodes.UNAUTHORIZED);
    });

    it('should pass Unauthorized error to next when session is undefined', async () => {
      mockAuth.api.getSession.mockResolvedValue(undefined);
      const authGuard = createAuthGuard(mockAuth);

      await authGuard(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = next.mock.calls[0][0];
      expect(error.message).toBe('Unauthorized');
      expect(error.statusCode).toBe(statusCodes.UNAUTHORIZED);
    });

    it('should pass errors from auth.api.getSession to next', async () => {
      const error = new Error('Database connection failed');
      mockAuth.api.getSession.mockRejectedValue(error);
      const authGuard = createAuthGuard(mockAuth);

      await authGuard(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should set both user and session on req object', async () => {
      const session = sampleSessions[1];
      mockAuth.api.getSession.mockResolvedValue(session);
      const authGuard = createAuthGuard(mockAuth);

      await authGuard(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.session).toBeDefined();
      expect(req.user.id).toBe(session.user.id);
      expect(req.user.email).toBe(session.user.email);
      expect(req.user.role).toBe(session.user.role);
    });
  });

  describe('restrictTo', () => {
    beforeEach(() => {
      req.user = sampleUsers[0]; // User role
    });

    it('should allow user with matching role', () => {
      const middleware = restrictTo('user');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should allow user with one of multiple roles', () => {
      const middleware = restrictTo('user', 'moderator', 'admin');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should throw Forbidden error when user role does not match', () => {
      const middleware = restrictTo('admin');

      const error = getThrownError(() => middleware(req, res, next));

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Forbidden');
      expect(error.statusCode).toBe(statusCodes.FORBIDDEN);
      expect(next).not.toHaveBeenCalled();
    });

    it('should throw Forbidden error when user has no role', () => {
      req.user = { id: 'user-1', name: 'User Without Role' };
      const middleware = restrictTo('admin', 'moderator');

      expect(() => {
        middleware(req, res, next);
      }).toThrow(AppError);

      expect(next).not.toHaveBeenCalled();
    });

    it('should throw Forbidden error when user object is missing', () => {
      req.user = undefined;
      const middleware = restrictTo('admin');

      expect(() => {
        middleware(req, res, next);
      }).toThrow(AppError);

      expect(next).not.toHaveBeenCalled();
    });

    it('should allow admin user to access admin-restricted route', () => {
      req.user = sampleUsers[1]; // Admin user
      const middleware = restrictTo('admin');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should deny regular user to access admin-restricted route', () => {
      req.user = sampleUsers[0]; // Regular user
      const middleware = restrictTo('admin');

      expect(() => {
        middleware(req, res, next);
      }).toThrow(AppError);

      expect(next).not.toHaveBeenCalled();
    });

    it('should handle multiple restrictTo checks in sequence', () => {
      req.user = sampleUsers[1]; // Admin user
      const restrictAdmin = restrictTo('admin');
      const restrictUser = restrictTo('user');

      // Admin can access admin route
      restrictAdmin(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);

      // Reset next mock
      next.mockClear();

      // Admin cannot access user-only route (in this scenario)
      expect(() => {
        restrictUser(req, res, next);
      }).toThrow(AppError);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
