import postController from "../controllers/post-controller.js";
import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth.js";
import { getUserId } from "../middlewares/getUserId.js";

export const postRouter = new Router()

postRouter.get('/', postController.getAll)
postRouter.post('/', checkAuth, postController.create)
postRouter.get('/user/:userId', postController.getByUserId)
postRouter.get('/:postId', getUserId, postController.getOne)
postRouter.delete('/:postId', checkAuth, postController.delete)
postRouter.put('/:postId', checkAuth, postController.update)
