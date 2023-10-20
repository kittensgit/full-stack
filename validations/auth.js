import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'Invalid mail format').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({
        min: 5,
    }),
    body('fullName', 'Enter your name').isLength({ min: 2 }),
    body('avatarUrl', 'Invalid link to avatar').optional().isURL(),
];
