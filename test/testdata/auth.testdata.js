export const sampleUsers = [
  {
    id: 'user-1',
    name: 'Alice',
    email: 'alice@example.com',
    role: 'user',
  },
  {
    id: 'user-2',
    name: 'Bob',
    email: 'bob@example.com',
    role: 'admin',
  },
];

export const sampleSessions = [
  {
    user: sampleUsers[0],
    session: {
      id: 'session-1',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  {
    user: sampleUsers[1],
    session: {
      id: 'session-2',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
];

export const authPayloads = {
  missingEmailSignUp: {
    name: 'Missing Email User',
    password: 'password123',
  },
  missingPasswordSignUp: {
    name: 'Missing Password User',
    email: 'missing-password@example.com',
  },
  missingEmailSignIn: {
    password: 'password123',
  },
  missingPasswordSignIn: {
    email: 'missing-password-login@example.com',
  },
  invalidSignIn: {
    email: 'not-found@example.com',
    password: 'wrong-password',
  },
};

export const buildAuthPayload = (overrides = {}) => ({
  name: 'Auth Test User',
  email: `auth-${Date.now()}@example.com`,
  password: 'password123',
  ...overrides,
});

export const invalidUCredentials = {
  email: 'invalid@example.com',
  password: 'wrong-password',
};

export const validCredentialReesuet = {
  email: sampleUsers[0].email,
  namne: sampleUsers[0].name,
  password: 'password123',
};

export const validCredentials = {
  email: sampleUsers[0].email,
  password: 'password123',
};
