import asyncHandler from "express-async-handler";
import User from "../../models/User.js";
import bcrypt from "bcrypt";
import uploadToCloudinary from "../../utils/cloudinaryUpload.js";

const updateProfile = asyncHandler(async (req, res) => {
  let {
    name,
    email,
    password,
    gender,
    country,
    countryCode,
    city,
    dob,
    school,
    college,
    university,
    workplace,
    contactNumber,
    relationshipStatus,
    profileStatus,
    reasonOfBeingHere,
    aboutYourself,
  } = req.body;

  let updatedUser;

  updatedUser = await User.findOneAndUpdate(
    { email: req.email },
    {
      name,
      email,
      gender,
      country,
      countryCode,
      city,
      dob,
      school,
      college,
      university,
      workplace,
      contactNumber,
      relationshipStatus,
      profileStatus,
      reasonOfBeingHere,
      aboutYourself,
    },
    { new: true }
  );
  if (req.file !== undefined) {
    let profilePic = await uploadToCloudinary(req.file);
    updatedUser = await User.findOneAndUpdate(
      { email: req.email },
      {
        profilePic,
      },
      { new: true }
    );
  }
  if (password !== "") {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    updatedUser = await User.findOneAndUpdate(
      { email: req.email },
      {
        password,
      },
      { new: true }
    );
  }

  if (updatedUser) {
    return res.status(200).json({ message: "User updated successfully" });
  } else {
    return res.status(404).json({ error: "User not found" });
  }
});

export default updateProfile;
