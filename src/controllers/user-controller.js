import userService from "../service/user-service.js"
import { validationResult } from 'express-validator'

class UserController {
  async updateAvatar(req, res, next) {
    try {
      const { img } = req.files
      const userId = req.user._id

      const url = await userService.updateAvatar(img, userId)
     
      return res.json({url})
    } catch (error) {
      next(error)
    }
  }

  async updateUser(req, res, next) {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { nickname, newPassword, email, password } = req.body
      const userId = req.user._id

      const updateUser = await userService.updateUser(nickname, newPassword, email, password, userId)

      return res.json(updateUser)
    } catch (error) {
      next(error)
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params
      const user = await userService.getOne(id)

      return res.json(user)
    } catch (error) {
      next(error)
    }
  }
}


export default new UserController()