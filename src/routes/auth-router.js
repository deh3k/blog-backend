import { Router } from "express";
import authController from "../controllers/auth-controller.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { registerValidator } from "../validators/validators.js";

export const authRouter = new Router()

authRouter.post('/register', registerValidator, authController.register)
authRouter.post('/login', authController.login)
authRouter.get('/me', checkAuth, authController.authMe)
