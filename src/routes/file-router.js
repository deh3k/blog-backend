import { Router } from "express";
import fileController from "../controllers/file-controller.js";
import { fileUploadValidator } from "../validators/validators.js";


export const fileRouter = new Router()

fileRouter.post('/upload', fileUploadValidator, fileController.uploadFile)
fileRouter.delete('/deleteFile/:imgSrc', fileController.deleteFile)

