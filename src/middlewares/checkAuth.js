import createHttpError from "http-errors"
import tokenService from "../service/token-service.js"

export const checkAuth = async (req, res, next) => {
  try {
    if(!req.headers.authorization) {
      throw createHttpError(401, "You're not authorized")
    }
    const token = req.headers.authorization.split(' ')[1]
    if(!token) {
      throw createHttpError(401, "You're not authorized")
    }
    const tokenData = tokenService.valideAccessToken(token)
    if(!tokenData) {
      throw createHttpError(401, "You're not authorized")
    }
    
    req.user = {...tokenData}
    next()
  } catch (error) {
    next(error)
  }
}