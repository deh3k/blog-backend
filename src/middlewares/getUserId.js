import createHttpError from "http-errors"
import tokenService from "../service/token-service.js"

export const getUserId = async (req, res, next) => {
  try {
    let userId = null
    if(req.headers.authorization) {    
      const token = req.headers.authorization.split(' ')[1]
        if(token) {
          const tokenData = tokenService.valideAccessToken(token)
          if(tokenData) {
            userId = tokenData._id
          }
      }
    }
    req.userId = userId
    next()
  } catch (error) {
    next(error)
  }
}