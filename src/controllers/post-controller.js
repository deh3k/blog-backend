import fileService from "../service/file-service.js"
import postService from "../service/post-service.js"
import { validationResult } from 'express-validator'
import postModel from "../models/post-model.js"
import createHttpError from "http-errors"
import userModel from "../models/user-model.js"

class PostController {
  async getAll(req, res, next) {
    try {
      let { page=1, limit=8, term, sort='createdAt', category, author } = req.query

      const data = await postService.getAll(page, limit, term, sort, category, author)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  }

  async getOne(req, res, next) {
    try {
      const { postId } = req.params
      
      const post = await postService.getOne(postId, req.userId)
      return res.json(post)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { title, tags, img, text, categories } = req.body
      const author = req.user._id

      const postId = await postService.create(title, tags, img, text, categories, author)

      return res.json(postId)
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    try {
      const { postId } = req.params

      const post = await postService.delete(postId, req.user._id)
      if(post.img) {
        await fileService.deleteFile(post.img)
      }

      return res.json(post)
    } catch (error) {
      next(error)
    }
  }

  async update(req, res, next) {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { postId } = req.params
      const { title, tags, img, text, categories } = req.body

      const newPost = await postService.update(postId, req.user._id, title, tags, img, text, categories)

      return res.json(newPost)
    } catch (error) {
      next(error)
    }
  }
}

export default new PostController()