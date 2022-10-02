import jwt from 'jsonwebtoken'
import tokenModel from '../models/token-model.js'

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '1h'})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})

    return {
      accessToken,
      refreshToken,
    }
  }

  valideAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      return userData
    } catch (error) {
      return null
    }
  }

  valideRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      return userData
    } catch (error) {
      return null
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await tokenModel.findOne({user: userId})
    if(tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }

    const token = await tokenModel.create({user: userId, refreshToken})
    return token
  } 

  async removeToken(refreshToken) {
    const token = await tokenModel.findOneAndDelete({refreshToken})
    return token
  }
}

export default new TokenService()