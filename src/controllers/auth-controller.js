import authService from "../service/auth-service.js"
import { validationResult } from 'express-validator'

class AuthController {
  async register(req, res, next) {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      
      const {email, password, nickname} = req.body

      const authData = await authService.register(email, password, nickname)

      res.cookie('refreshToken', authData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(authData.data)
    } catch (error) {
      next(error)
    }
  }

  async login(req, res, next) {
    try {
      const {email, password} = req.body

      const authData = await authService.login(email, password)

      res.cookie('refreshToken', authData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(authData.data)
    } catch (error) {
      next(error)
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies

      const token = await authService.logout(refreshToken)
      
      res.clearCookie('refreshToken')
      return res.json({token})
    } catch (error) {
      next(error)
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      
      const authData = await authService.refresh(refreshToken)

      res.cookie('refreshToken', authData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(authData.data)
    } catch (error) {
      res.clearCookie('refreshToken')
      next(error)
    }
  }
}


export default new AuthController()