import createHttpError from 'http-errors'
import path from 'path'
import fs from 'fs'
import * as uuid from 'uuid'


class FileService {
  saveFile(file) {
    try {
      if(!fs.existsSync(path.resolve('static'))) {
        fs.mkdirSync('static')
      }
      const fileName = uuid.v4() + '.jpg'
      const filePath = path.resolve('static', fileName)
      file.mv(filePath)
      return fileName
    } catch (error) {
      throw createHttpError(500, error)
    }
  }

  deleteFile(fileName) {
    try {
      const filePath = path.resolve('static', fileName)
      fs.unlinkSync(filePath)
    } catch (error) {
      console.log(error)
    } 
  }
}

export default new FileService()