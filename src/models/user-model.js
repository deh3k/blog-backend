import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: {type: String, require: true, unique: true},
  nickname: {type: String, require: true, unique: true},
  password: {type: String, require: true},
  photo: {type: String},
}, 
{
  timestamps: true
})

export default mongoose.model('User', userSchema) 