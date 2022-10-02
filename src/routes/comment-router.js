import { Router } from "express";
import { checkAuth } from '../middlewares/checkAuth.js'
import commentController from '../controllers/comment-cotroller.js'

export const commentRouter = new Router()

commentRouter.get('/:postId', commentController.getAllByPostId)
commentRouter.post('/', checkAuth, commentController.create)
commentRouter.put('/:commentId', checkAuth, commentController.update)
commentRouter.delete('/:commentId', checkAuth, commentController.delete)

