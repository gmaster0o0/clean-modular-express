import catchAsync from '../utils/catch-async.js';
import AppError from '../utils/app-error.js';
import { statusCodes } from '../utils/status-codes.js';

export const createUserController = (prisma) => ({
  getAllUsers: catchAsync(async (req, res, next) => {
    const users = await prisma.user.findMany();

    res.status(statusCodes.OK).json({
      status: 'success',
      results: users.length,
      data: { users },
    });
  }),

  createUser: catchAsync(async (req, res, next) => {
    const { name, email } = req.body;

    if (!name || !email) {
      throw new AppError('Both name and email are required.', statusCodes.BAD_REQUEST);
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    res.status(statusCodes.CREATED).json({
      status: 'success',
      data: { user },
    });
  }),

  getUserById: catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError(`No user found with id ${id}.`, statusCodes.NOT_FOUND);
    }

    res.status(statusCodes.OK).json({
      status: 'success',
      data: { user },
    });
  }),

  updateUser: catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, email } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new AppError(`No user found with id ${id}.`, statusCodes.NOT_FOUND);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: name ?? existingUser.name,
        email: email ?? existingUser.email,
      },
    });

    res.status(statusCodes.OK).json({
      status: 'success',
      data: { user: updatedUser },
    });
  }),

  deleteUser: catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new AppError(`No user found with id ${id}.`, statusCodes.NOT_FOUND);
    }

    await prisma.user.delete({ where: { id } });

    res.status(statusCodes.NO_CONTENT).send();
  }),
});
