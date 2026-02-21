import { Router } from 'express';
import { login, register, refresh, logout, verifyEmailController } from '../controllers/auth.controller';
import { loginValidation, registerValidation } from '../validators/authValidation';
import { validate } from '../middleware/validate';

const router = Router();

router.post('/register',registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/verify-email', verifyEmailController);

export default router;