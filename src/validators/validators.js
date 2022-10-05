import { body } from 'express-validator'

export const registerValidator = [
  body('email').isEmail(),
  body('nickname').isLength({ max: 20}),
  body('password').isLength({ min: 8 }),
]

export const loginValidator = [
  body('email').isEmail(),
  body('password').exists()
]

export const updateUserValidator = [
  body('email').optional().isEmail(),
  body('nickname').optional().isLength({ max: 20}),
  body('password').exists().isString(),
  body('newPassword').optional().isLength({ min: 8 }),
]

export const fileUploadValidator = [
  body('img').exists()
]

export const postValidator = [
  body('title').exists(),
  body('tags').isArray(),
  body('categories').isArray(),
  body('text').exists(),
  body('img').optional()
]

