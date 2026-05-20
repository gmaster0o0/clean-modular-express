import { describe, it, expect } from 'vitest';
import supertest from 'supertest';
import app from '../../app/app.js';
import { sampleUsers, validCredentialReesuet } from '../../test/testdata/auth.testdata.js';
import { statusCodes } from '../../app/utils/status-codes.js';

describe('auth routes', () => {
  describe('POST /auth/sign-up/email', () => {
    it('returns validation error when auth user schema is incompatible', async () => {
      const response = await supertest(app).post('/auth/sign-up/email').send(validCredentialReesuet);

      const { body } = response;
      const cookies = response.headers['set-cookie'] || [];

      expect(response.status).toBe(statusCodes.BAD_REQUEST);
      expect(body).toBeDefined();
      expect(cookies.length).toBe(0);
    });
  });

  describe('POST /auth/sign-in/email', () => {
    it('returns unauthorized for invalid credentials', async () => {
      const { email } = sampleUsers[1];

      const response = await supertest(app).post('/auth/sign-in/email').send({
        email,
        password: 'wrong-password',
      });

      const { body } = response;

      expect(response.status).toBe(statusCodes.UNAUTHORIZED);
      expect(body.code).toBe('INVALID_EMAIL_OR_PASSWORD');
    });
  });

  describe('GET /auth/get-session', () => {
    it('returns null when an invalid session cookie is provided', async () => {
      const response = await supertest(app)
        .get('/auth/get-session')
        .set('Cookie', 'better-auth.session_token=invalid-session-token');
      const { body } = response;

      expect(response.status).toBe(statusCodes.OK);
      expect(body).toBeNull();
    });

    it('returns null when no session cookie is provided', async () => {
      const response = await supertest(app).get('/auth/get-session');
      const { body } = response;

      expect(response.status).toBe(statusCodes.OK);
      expect(body).toBeNull();
    });
  });
});
