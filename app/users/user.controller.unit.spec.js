import { describe, it, expect, beforeEach } from 'vitest';
import { sampleUsers, newUser } from '../../test/testdata/users.testdata.js';
import { statusCodes } from '../utils/status-codes.js';
import { createMockReq, createMockRes, createMockNext } from '../../test/mocks/http.mock.js';
import { createPrismaMock } from '../../test/mocks/prisma.mock.js';

import { createUserController } from './user.controller.js';

describe('UserController', () => {
  let req;
  let res;
  let next;
  let userController;
  let mockPrisma;

  beforeEach(() => {
    mockPrisma = createPrismaMock();
    userController = createUserController(mockPrisma);
    req = createMockReq();
    res = createMockRes();
    next = createMockNext();
  });

  it('should return all users', async () => {
    mockPrisma.user.findMany.mockResolvedValue(sampleUsers);

    await userController.getAllUsers(req, res, next);

    expect(res.statusCode).toBe(statusCodes.OK);
    expect(res.body).toEqual({
      status: 'success',
      results: sampleUsers.length,
      data: { users: sampleUsers },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should create a new user', async () => {
    mockPrisma.user.create.mockResolvedValue(newUser);
    req.body = { name: newUser.name, email: newUser.email };

    await userController.createUser(req, res, next);

    expect(res.statusCode).toBe(statusCodes.CREATED);
    expect(res.body).toEqual({
      status: 'success',
      data: { user: newUser },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return a user by id', async () => {
    const user = sampleUsers[1];
    mockPrisma.user.findUnique.mockResolvedValue(user);
    req.params = { id: user.id };

    await userController.getUserById(req, res, next);

    expect(res.statusCode).toBe(statusCodes.OK);
    expect(res.body).toEqual({
      status: 'success',
      data: { user },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should update a user', async () => {
    const existingUser = sampleUsers[0];
    const updatedUser = { ...existingUser, name: 'Alice Updated' };

    mockPrisma.user.findUnique.mockResolvedValue(existingUser);
    mockPrisma.user.update.mockResolvedValue(updatedUser);
    req.params = { id: existingUser.id };
    req.body = { name: updatedUser.name };

    await userController.updateUser(req, res, next);

    expect(res.statusCode).toBe(statusCodes.OK);
    expect(res.body).toEqual({
      status: 'success',
      data: { user: updatedUser },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should delete a user', async () => {
    const existingUser = sampleUsers[1];
    mockPrisma.user.findUnique.mockResolvedValue(existingUser);
    mockPrisma.user.delete.mockResolvedValue(existingUser);
    req.params = { id: existingUser.id };

    await userController.deleteUser(req, res, next);

    expect(res.statusCode).toBe(statusCodes.NO_CONTENT);
    expect(res.body).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
  });
});
