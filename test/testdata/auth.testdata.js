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
