import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  video:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  foodPartner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "foodpartner"
  },
  likeCount:{
    type: Number,
    default: 0
  },
  savesCount:{
    type: Number,
    default: 0
  },
  commentsCount:{
    type: Number,
    default: 0
  },
  thumbnail:{
    type: String,
    default: null
  }
})
  

const foodModel = mongoose.model("fooditem", foodItemSchema)

export default foodModel