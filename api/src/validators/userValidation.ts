import { body } from 'express-validator';

export const updateMeValidation = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

export const deleteAccountValidation = [
  body('password')
    .notEmpty()
    .withMessage('Password is required to delete your account'),
];
