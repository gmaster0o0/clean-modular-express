import express from 'express';
import { createUserController } from './user.controller.js';
import { prisma } from '../../prisma/db.js';
import { createAuthGuard } from '../auth/auth.guard.js';
import { auth } from '../auth/auth.js';
import validate from '../middlewares/validate.js';
import { createUserSchema, updateUserSchema, userIdParamSchema } from './user.schema.js';

const router = express.Router();
const userController = createUserController(prisma);
const authGuard = createAuthGuard(auth);

router.use(authGuard); // Protect all user routes with authentication guard
router.get('/', userController.getAllUsers);
router.post('/', validate(createUserSchema), userController.createUser);
router.get('/:id', validate(userIdParamSchema, 'params'), userController.getUserById);
router.put(
  '/:id',
  validate(updateUserSchema, 'body'),
  validate(userIdParamSchema, 'params'),
  userController.updateUser,
);
router.delete('/:id', validate(userIdParamSchema, 'params'), userController.deleteUser);

export default router;
