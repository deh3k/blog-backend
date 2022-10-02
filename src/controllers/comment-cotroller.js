import commentService from "../service/comment-service.js"


class CommentCotroller { 
  async getAllByPostId(req, res, next) {
    try {
      const { postId } = req.params
      const { limit } = req.query

      const comments = await commentService.getAllByPostId(postId, limit)
      return res.json(comments)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      const { postId, text } = req.body
      const author = req.user._id

      const comment = await commentService.create(postId, author, text)

      return res.json(comment)
    } catch (error) {
      next(error)
    }
  }

  async update(req, res, next) {
    try {
      const { text } = req.body
      const { commentId } = req.params

      const comment = await commentService.update(commentId, text)

      return res.json(comment)
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    try {
      const { commentId } = req.params
      const userId = req.user._id

      const comment = await commentService.delete(commentId, userId)

      return res.json(comment)
    } catch (error) {
      next(error)
    }
  }
}

export default new CommentCotroller()