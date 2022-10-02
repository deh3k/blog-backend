import { Router } from "express";
import userController from '../controllers/user-controller.js'
import { checkAuth } from "../middlewares/checkAuth.js";
import { updateUserValidator } from "../validators/validators.js";

export const userRouter = new Router()

userRouter.put('/', checkAuth, updateUserValidator, userController.updateUser)
userRouter.put('/ava', checkAuth, userController.updateAvatar)
userRouter.get('/:id', userController.getOne)