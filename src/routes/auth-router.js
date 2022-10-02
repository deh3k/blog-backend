import { Router } from "express";
import authController from "../controllers/auth-controller.js";
import { registerValidator } from "../validators/validators.js";
import { body } from 'express-validator'


export const authRouter = new Router()

authRouter.post('/register', registerValidator, authController.register)
authRouter.post('/login', authController.login)
authRouter.delete('/login', authController.logout)
authRouter.get('/refresh', authController.refresh)
