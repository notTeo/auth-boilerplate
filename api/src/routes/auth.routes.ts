import { Router } from 'express';
import { login, register, refresh, logout, verifyEmailController, forgotPasswordController, resetPasswordController, googleCallback, googleFailure } from '../controllers/auth.controller';
import { forgotPasswordValidation, loginValidation, registerValidation, resetPasswordValidation } from '../validators/authValidation';
import { validate } from '../middleware/validate';
import passport from '../config/passport';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'], session: false }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/google/failure' }),
  googleCallback,
);

router.get('/google/failure', googleFailure);

router.post('/register',registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/verify-email', verifyEmailController);
router.post('/forgot-password', forgotPasswordValidation, validate, forgotPasswordController);
router.post('/reset-password', resetPasswordValidation, validate, resetPasswordController);

export default router;