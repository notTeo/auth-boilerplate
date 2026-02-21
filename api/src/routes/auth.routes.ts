import { Router } from 'express';
import { login, register, refresh, logout, verifyEmailController, forgotPasswordController, resetPasswordController } from '../controllers/auth.controller';
import { forgotPasswordValidation, loginValidation, registerValidation, resetPasswordValidation } from '../validators/authValidation';
import { validate } from '../middleware/validate';

const router = Router();

router.post('/register',registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/verify-email', verifyEmailController);
router.post('/forgot-password', forgotPasswordValidation, validate, forgotPasswordController);
router.post('/reset-password', resetPasswordValidation, validate, resetPasswordController);

export default router;