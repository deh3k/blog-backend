import postController from "../controllers/post-controller.js";
import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth.js";
import { getUserId } from "../middlewares/getUserId.js";
import { postValidator } from "../validators/validators.js";

export const postRouter = new Router()

postRouter.get('/', postController.getAll)
postRouter.post('/', checkAuth, postValidator, postController.create)
postRouter.get('/:postId', getUserId, postController.getOne)
postRouter.delete('/:postId', checkAuth, postController.delete)
postRouter.put('/:postId', checkAuth, postValidator, postController.update)
