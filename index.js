import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import router from './src/routes/index.js'
import { errorMiddleware } from './src/middlewares/error-middleware.js'
import fileUpload from 'express-fileupload'

dotenv.config()

const PORT = process.env.PORT || 5000
const DB_URL = process.env.DB_URL
const CLIENT_URL = process.env.CLIENT_URL

const app = express()


app.use(express.json())
app.use(fileUpload({
  limits: {
    fileSize: 1.5 * 1024 * 1024
  },
}))
app.use(cors({
  credentials: true,
  origin: CLIENT_URL,
}))
app.use(cookieParser())
app.use('/api', router)
app.use(express.static('static'))
app.use(errorMiddleware)

const start = async () => {
  try {
    await mongoose.connect(DB_URL)
    app.listen(PORT, () => console.log(`Server has started on PORT ${PORT}`))
  } catch (error) {
    console.log(error)
  }
}

start()