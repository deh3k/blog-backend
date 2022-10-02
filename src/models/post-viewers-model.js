import mongoose from "mongoose";

const postViewersSchema = mongoose.Schema({
  postId: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', require: true},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true}
},
{
  timestamps: true
})

postViewersSchema.index({createdAt: 1}, {expireAfterSeconds: 7200})

export default mongoose.model('Post-viewers', postViewersSchema)