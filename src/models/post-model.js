import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: {type: String, require: true, index: true},
  img: String,
  tags: {type: [String], index: true},
  text: {type: String},
  categories: {type: [String], index: true},
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  viewsCount: {type: Number, default: 0},
  commentsCount: {type: Number, default: 0},
  },
{
  timestamps: true
})

postSchema.index({title: "text"})

export default mongoose.model('Post', postSchema)