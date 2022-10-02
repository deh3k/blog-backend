import userModel from "../models/user-model.js"
import createHttpError from "http-errors"
import * as bcrypt from 'bcrypt'
import tokenService from "../service/token-service.js"
import tokenModel from "../models/token-model.js"
import { UserDto } from "../dtos/UserDto.js"


const authHandler = async (user) => {
  const userDto = new UserDto(user)
  const tokens = tokenService.generateTokens({ ...userDto })
  await tokenService.saveToken(user._id, tokens.refreshToken)

  return {
    data: {
      user: { ...userDto },
      accessToken: tokens.accessToken
    },
    refreshToken: tokens.refreshToken
  }
}

class AuthService {
  async register(email, password, nickname) {
    const isEmailTaken = await userModel.findOne({ email })
    const isNicknameTaken = await userModel.findOne({ nickname })

    if (isEmailTaken || isNicknameTaken) {
      throw createHttpError(400, `[${!!isEmailTaken ? "email" : ''} ${!!isNicknameTaken ? "nickname" : ''}]: is already taken`
      )
    }

    const hashPassword = await bcrypt.hash(password, 6)
    const user = await userModel.create({ email, password: hashPassword, nickname, photo: '' })

    const authData = await authHandler(user)
    return authData
  }

  async login(email, password) {
    const user = await userModel.findOne({ email })
    if (!user) {
      throw createHttpError(400, `Wrong email or password`)
    }
    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw createHttpError(400, `Wrong email or password`)
    }

    const authData = await authHandler(user)
    return authData
  }

  async logout(refreshToken) {
    if (!refreshToken) {
      throw createHttpError(401, "You're not authorized")
    }
    const token = await tokenService.removeToken(refreshToken)
    return { ...token._doc }
  }

  async refresh(refreshToken) {
    const userData = tokenService.valideRefreshToken(refreshToken)
    const tokenFromDb = await tokenModel.findOne({ refreshToken })

    if (!userData || !tokenFromDb) {
      throw createHttpError(401, "You're not authorized")
    }

    const user = await userModel.findById(userData._id)
    const authData = await authHandler(user)

    return authData
  }
}


export default new AuthService()