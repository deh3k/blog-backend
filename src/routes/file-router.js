import { Router } from "express";
import fileController from "../controllers/file-controller.js";


export const fileRouter = new Router()

fileRouter.post('/upload', fileController.uploadFile)
fileRouter.delete('/deleteFile/:imgSrc', fileController.deleteFile)

