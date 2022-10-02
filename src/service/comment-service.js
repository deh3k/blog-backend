import createHttpError from "http-errors"
import commentModel from "../models/comment-model.js"
import postModel from "../models/post-model.js"
import mongoose from 'mongoose'

class CommentService {
  async getAllByPostId(postId, limit=20) {
    if (!mongoose.isValidObjectId(postId)) {
      throw createHttpError(404, `Post id ${postId} not found`)
    }
    const comments = await commentModel
      .find({ postId })
      .sort({'createdAt': -1})
      .populate('author', '-email -password')
      .limit(limit)
    return comments
  }

  async create(postId, author, text) {
    if (!mongoose.isValidObjectId(postId)) {
      throw createHttpError(404, `Post id ${postId} not found`)
    }
    const post = await postModel.findById(postId)
    if(!post) {
      throw createHttpError(400, `Post id ${postId} does not exist`)
    }

    const comment = await (await commentModel.create({postId, author, text})).populate('author', '-email -password')

    post.commentsCount += 1
    post.save()

    return comment
  }

  async update(commentId, text) {
    if (!mongoose.isValidObjectId(commentId)) {
      throw createHttpError(404, `Post id ${postId} not found`)
    }
    const comment = await commentModel.findByIdAndUpdate(commentId, {text}, {new: true  })
    return comment
  }

  async delete(commentId, userId) {
    if (!mongoose.isValidObjectId(commentId)) {
      throw createHttpError(404, `Post id ${postId} not found`)
    }
    const commentToDel = await commentModel.findById(commentId)
    if(!commentToDel) {
      throw createHttpError(400, `Comment id ${commentId} does not exist`)
    } 

    if (commentToDel.author.toString() !== userId) {
      throw createHttpError(401, "You are not the author of the comment")
    }

    const comment = await commentModel.findByIdAndDelete(commentId)

    const post = await postModel.findById(comment.postId)
    post.commentsCount -= 1
    post.save()    

    return comment
  }
}

export default new CommentService()