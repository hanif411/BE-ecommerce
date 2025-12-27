import User from "../models/authModels.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "6d",
  });
};

const createSendResToken = (user, statuscode, res) => {
  const token = signToken(user._id);

  const isDev = process.env.NODE_ENV === "development" ? false : true;

  const cookieOption = {
    expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  res.cookie("jwt", token, cookieOption);

  user.password = undefined;

  res.status(statuscode).json({
    data: user,
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  const createUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });
  createSendResToken(createUser, 201, res);
});

export const loginUser = asyncHandler(async (req, res) => {
  // buat validasi harus ada email dan pasword
  if (!req.body.email || !req.body.password) {
    res.status(400);
    throw new Error("email dan password harus di isi");
  }

  //validasi email ada dan sesuai dengan database
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );

  // check passwordnya
  if (user && (await user.comparePassword(req.body.password))) {
    createSendResToken(user, 200, res);
  } else {
    res.status(400);
    throw new Error("email atau password salah");
  }
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.User._id);
  if (!user) {
    res.status(404);
    throw new Error("user tidak ditemukan");
  } else {
    res.status(200).json({
      data: user,
    });
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
  res.status(200).json({
    status: "success",
    message: "logout berhasil",
  });
});
