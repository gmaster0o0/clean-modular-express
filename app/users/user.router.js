import express from 'express';
import { createUserController } from './user.controller.js';
import { prisma } from '../../prisma/db.js';
import { createAuthGuard } from '../auth/auth.guard.js';
import { auth } from '../auth/auth.js';

const router = express.Router();
const userController = createUserController(prisma);
const authGuard = createAuthGuard(auth);

router.use(authGuard); // Protect all user routes with authentication guard
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
