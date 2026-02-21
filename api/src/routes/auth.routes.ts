import { Router } from 'express';
import { register } from '../controllers/auth.controller';
import { registerValidation } from '../validators/authValidation';
import { validate } from '../middleware/validate';

const router = Router();

router.post('/register',registerValidation, validate, register);

export default router;