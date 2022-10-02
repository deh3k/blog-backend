import { body } from 'express-validator'

export const registerValidator = [
  body('email').isEmail(),
  body('nickname').isLength({ max: 20}),
  body('password').isLength({ min: 8 }),
]

export const updateUserValidator = [
  body('email').optional().isEmail(),
  body('nickname').optional().isLength({ max: 20}),
  body('newPassword').optional().isLength({ min: 8 }),
]
