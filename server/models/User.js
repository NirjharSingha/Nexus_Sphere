import mongoose from "mongoose";
import hashPassword from "../middlewares/hashPassword.js";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 24,
    },
    gender: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    city: String,
    dob: Date,
    school: String,
    college: String,
    university: String,
    workplace: String,
    contactNumber: String,
    relationshipStatus: String,
    reasonOfBeingHere: String,
    opinionOnEquity: String,
    friends: {
      type: Array,
      default: [],
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    posts: {
      type: Array,
      default: [],
    },
    yourGroups: {
      type: Array,
      default: [],
    },
    otherGroups: {
      type: Array,
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    profilePic: {
      type: String,
    },
  },
  {
    collection: "Users",
  }
);

userSchema.pre("save", hashPassword);
userSchema.pre("findOneAndUpdate", hashPassword);

const User = mongoose.model("User", userSchema);
export default User;