import createHttpError from "http-errors"
import postModel from "../models/post-model.js"
import postViewersModel from "../models/post-viewers-model.js"
import mongoose from 'mongoose'
import fileService from "./file-service.js"

class PostService {
  async getAll(page = 1, limit = 2, term, sort, category, author) {
    const conditions = {}
    const conditionsRules = {}
    const sortCond = {}

    if (term &&  !term.startsWith('#')) {
      conditions.$text = { $search: term }
      conditionsRules.score = { $meta: "textScore" }
      sortCond.score = { $meta: "textScore" }
    }

    else if (term && term.startsWith('#')) {
      conditions.tags = term
    }

    if (sort === 'views') {
      sortCond.viewsCount = -1 
    }
    else if (sort === 'createdAt') {
      sortCond.createdAt = -1 
    }

    if (author) {
      if (!mongoose.isValidObjectId(author)) {
        throw createHttpError(404, `User id ${author} not found`)
      }
      conditions.author = author
    }

    if (category) {
      conditions.categories = category
    }

    const totalCount = await postModel.find(conditions).count()
    const posts = await postModel
      .find(conditions, conditionsRules)
      .populate('author', '-password -email')
      .sort(sortCond)
      .skip((page - 1) * limit)
      .limit(limit)
    return { totalCount, posts }
  }

  async getOne(id, userId) {
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError(404, `Post id ${postId} not found`)
    }
    const post = await postModel.findById(id).populate('author', '_id nickname photo  ')
    if (!post) {
      throw createHttpError(404, `Post id ${postId} not found`)
    }

    const isPostView = await postViewersModel.findOne({ postId: post._id, userId })

    if (userId !== null && !isPostView && userId !== post.author._id.toString()) {
      post.viewsCount += 1
      post.save()
      await postViewersModel.create({ postId: post._id, userId })
    }

    return post
  }

  async create(title, tags, img, text, categories, author) {
    const post = await postModel.create({ title, tags, text, img, author, categories })

    return post._id
  }

  async delete(id, userId) {
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError(404, `Post id ${postId} not found`)
    }
    const postToDel = await postModel.findById(id)
    if (!postToDel) {
      throw createHttpError(404, `Post id ${postId} not found`)
    }
    if (postToDel.author.toString() !== userId) {
      throw createHttpError(401, "You are not the author of the article")
    }
    const post = await postModel.findByIdAndDelete(id)
    return post
  }

  async update(postId, userId, title, tags, img, text, categories) {
    if (!mongoose.isValidObjectId(postId)) {
      throw createHttpError(404, `Post id ${postId} not found`)
    }

    const postToUpd = await postModel.findById(postId)

    if (!postToUpd) {
      throw createHttpError(404, `Post id ${postId} not found`)
    }
    if (postToUpd.author.toString() !== userId) {
      throw createHttpError(403, "You are not the author of the article")
    }
    if (postToUpd.img && img) {
      fileService.deleteFile(postToUpd.img)
    }

    const post = await postModel.findByIdAndUpdate(postId, { title, tags, text, img, categories })
    return post
  }

  async getByUserId(userId, page, limit, term, sort) {
    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(404, `User id ${postId} not found`)
    }
    if (term) {
      const totalCount = await postModel.find({ $text: { $search: term }, author: userId }).count()
      const posts = await postModel
        .find(
          { $text: { $search: term }, author: userId },
          { score: { $meta: "textScore" } }
        )
        .sort({ score: { $meta: "textScore" } })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('author', '-password -email')
      return { totalCount, posts }
    }

    else if (sort === 'views') {
      const totalCount = await postModel.find({ author: userId }).count()
      const posts = await postModel
        .find({ author: userId })
        .populate('author', '-password -email')
        .sort({ 'viewsCount': -1 })
        .skip((page - 1) * limit)
        .limit(limit)

      return { totalCount, posts }
    }

    const totalCount = await postModel.find({ author: userId }).count()
    const posts = await postModel
      .find({ author: userId })
      .populate('author', '-password, -email')
      .sort({ 'createdAt': -1 })
      .skip((page - 1) * limit)
      .limit(limit)
    return { totalCount, posts }
  }
}

export default new PostService()