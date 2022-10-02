import { Router } from "express";
import { authRouter } from "./auth-router.js";
import { postRouter } from "./post-router.js";
import { userRouter } from "./user-router.js";
import { commentRouter } from "./comment-router.js";
import { fileRouter } from "./file-router.js";


const router = new Router()

router.use('/post', postRouter)
router.use('/user', userRouter)
router.use('/comment', commentRouter)
router.use('/', authRouter)
router.use('/', fileRouter)

export default router