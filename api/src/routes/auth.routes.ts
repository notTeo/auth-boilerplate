import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { loginValidation, registerValidation } from '../validators/authValidation';
import { validate } from '../middleware/validate';

const router = Router();

router.post('/register',registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

export default router;