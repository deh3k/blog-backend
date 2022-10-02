import fileService from "../service/file-service.js"  
import postModel from "../models/post-model.js"
import createHttpError from "http-errors"
import userModel from "../models/user-model.js"

class FileController {
  async uploadFile(req, res, next) {  
    try {
      const { img } = req.files

      const url = fileService.saveFile(img)
      res.json({url})
    } catch (error) {
      next(error)
    }
  }

  async deleteFile(req, res, next) {
    try {
      const { imgSrc } = req.params
      
      const post = await postModel.findOne({img: imgSrc})
      const user = await userModel.findOne({photo: imgSrc})

      if(post || user) {
        if(post) throw createHttpError(400, "You can't delete a file attached to a post")
        if(user) throw createHttpError(400, "You can't delete a file attached to a user")
      }

      fileService.deleteFile(imgSrc)
      res.json({message: "File deleted successfully"})
    } catch (error) {
      next(error)
    }
  }
}

export default new FileController()