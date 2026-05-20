import express from 'express';
import { createUserController } from './user.controller.js';
import { prisma } from '../../prisma/db.js';

const router = express.Router();
const userController = createUserController(prisma);

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
