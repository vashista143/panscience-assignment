import mongoose from "mongoose"

const userSchema= new mongoose.Schema({
name: {
    type: String,
    required: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role:{
    enum: ["user","admin"],
    type: String,
    default: "user"
  },
  password: {
    type: String,
    },
}, { timestamps: true });

const user = mongoose.model('user', userSchema);

export default user;