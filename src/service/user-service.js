import userModel from "../models/user-model.js"
import createHttpError from "http-errors"
import * as bcrypt from 'bcrypt'
import fileService from "./file-service.js"
import { UserDto } from "../dtos/UserDto.js"
import mongoose from 'mongoose'


class UserService {
  async updateAvatar(img, userId) {
    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(404, `Post id ${userId} not found`)
    }

    const user = await userModel.findById(userId) 
    if(!user) {
      throw createHttpError(404, `This user doesn't exist`)
    }

    if(user.photo) {
      fileService.deleteFile(user.photo)
    }

    const fileName = fileService.saveFile(img)
    const newUser = await userModel.findByIdAndUpdate(userId, { photo: fileName }, {new: true})

    return fileName
  }

  async updateUser(nickname, newPassword, email, password, userId) {
    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(404, `Post id ${userId} not found`)
    }
    if (userId === '632f0c9a29ffc3fdc489a01b') {
      throw createHttpError(403, `You can't change your test account details. Create your own account`)
    }

    const user = await userModel.findById(userId)

    const isPassEquals = await bcrypt.compare(password, user.password)
    const isEmailTaken = await userModel.findOne({ email })
    const isNicknameTaken = await userModel.findOne({ nickname })

    if (isEmailTaken || isNicknameTaken || !isPassEquals) {
      throw createHttpError(400, `[${!!isEmailTaken ? "email" : ''} ${!!isNicknameTaken ? "nickname" : ''} ${!isPassEquals ? 'password' : ''}]: validation error`
      )
    }

    let updatedPassword;
    if (newPassword) {
      updatedPassword = await bcrypt.hash(newPassword, 6)
    }
    const updatedUser = await userModel.findByIdAndUpdate(userId, { nickname, email, password: updatedPassword }, { new: true })
    const userDto = new UserDto(updatedUser)

    return { ...userDto }

  }

  async getOne(userId) {
    const user = await userModel.findById(userId).select('nickname photo')
    if (!user) {
      createHttpError(404, "User is not found")
    }

    return user
  }
}


export default new UserService()