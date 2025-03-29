import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';

const router = Router();

router.post('/', userController.upload.single('image'), userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/:id', userController.getUser);
router.put('/:id', userController.upload.single('image'), userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
