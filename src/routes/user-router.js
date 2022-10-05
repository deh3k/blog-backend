import { Router } from "express";
import userController from '../controllers/user-controller.js'
import { checkAuth } from "../middlewares/checkAuth.js";
import { fileUploadValidator, updateUserValidator } from "../validators/validators.js";

export const userRouter = new Router()

userRouter.put('/', checkAuth, updateUserValidator, userController.updateUser)
userRouter.put('/ava', checkAuth, fileUploadValidator, userController.updateAvatar)
userRouter.get('/:id', userController.getOne)