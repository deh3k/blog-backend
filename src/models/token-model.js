import mongoose from "mongoose";

const tokenSchema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  refreshToken: {type: String}
})

export default mongoose.model('token', tokenSchema)