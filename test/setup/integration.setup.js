import { beforeAll, beforeEach, afterAll } from 'vitest';

process.env.DATABASE_URL = 'file:./test/integration-test.db';

beforeAll(async () => {
  const { prisma } = await import('../../prisma/db.js');
  await prisma.$connect();

  await prisma.$executeRawUnsafe(
    'CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, emailVerified BOOLEAN NOT NULL DEFAULT 0, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);',
  );
  await prisma.$executeRawUnsafe(
    'CREATE TABLE IF NOT EXISTS session (id TEXT PRIMARY KEY, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, expiresAt DATETIME NOT NULL, token TEXT NOT NULL UNIQUE, userId TEXT NOT NULL, FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE);',
  );
  await prisma.$executeRawUnsafe(
    'CREATE TABLE IF NOT EXISTS account (id TEXT PRIMARY KEY, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, accountId TEXT NOT NULL, providerId TEXT NOT NULL, userId TEXT NOT NULL, password TEXT, FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE);',
  );
});

beforeEach(async () => {
  const { prisma } = await import('../../prisma/db.js');
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  const { prisma } = await import('../../prisma/db.js');
  await prisma.$disconnect();
});
