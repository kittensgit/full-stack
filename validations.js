import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Invalid mail format').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({
        min: 5,
    }),
];
export const registerValidation = [
    body('email', 'Invalid mail format').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({
        min: 5,
    }),
    body('fullName', 'Enter your name').isLength({ min: 2 }),
    body('avatarUrl', 'Invalid link to avatar').optional(),
];
export const postCreateValidation = [
    body('title', 'Enter article title').isLength({ min: 2 }).isString(),
    body('text', 'Enter article text').isLength({ min: 10 }).isString(),
    body('tags', 'Invalid tag format(specify array)').optional().isArray(),
    body('imageUrl', 'Invalid link to image').optional().isString(),
];
