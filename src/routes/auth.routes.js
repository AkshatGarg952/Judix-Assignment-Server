import express from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { registerValidator, loginValidator, updateProfileValidator } from '../validators/auth.validator.js';

const router = express.Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfileValidator, validate, updateProfile);

export default router;
