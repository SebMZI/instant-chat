import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "User firstname required"],
    minLength: 2,
    maxLength: 50,
  },
  lastname: {
    type: String,
    required: [true, "User lastname required"],
    minLength: 2,
    maxLength: 50,
  },
  username: {
    type: String,
    required: [true, "User username required"],
    minLength: 2,
    maxLength: 50,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "User email required"],
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "User password required"],
    minLength: 6,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
