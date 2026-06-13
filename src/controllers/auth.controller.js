import User from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens.js"

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
}

const generateTokens = (user) => {
  const payload = { _id: user._id, role: user.role }
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  }
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const exists = await User.findOne({ email })
  if (exists) throw new ApiError(409, "Email already registered")

  const user = await User.create({ name, email, password })
  const { accessToken, refreshToken } = generateTokens(user)

  user.refreshToken = refreshToken
  await user.save({ validateBeforeSave: false })

  const safeUser = { _id: user._id, name: user.name, email: user.email, role: user.role }

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(201, { user: safeUser, accessToken }, "Registered successfully"))
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select("+password +refreshToken")
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password")
  }

  const { accessToken, refreshToken } = generateTokens(user)
  user.refreshToken = refreshToken
  await user.save({ validateBeforeSave: false })

  const safeUser = { _id: user._id, name: user.name, email: user.email, role: user.role }

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user: safeUser, accessToken }, "Logged in successfully"))
})

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken
  if (!token) throw new ApiError(401, "Refresh token missing")

  const decoded = verifyRefreshToken(token)
  const user = await User.findById(decoded._id).select("+refreshToken")

  if (!user || user.refreshToken !== token) {
    throw new ApiError(401, "Invalid or expired refresh token")
  }

  const { accessToken, refreshToken } = generateTokens(user)
  user.refreshToken = refreshToken
  await user.save({ validateBeforeSave: false })

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { accessToken }, "Token refreshed"))
})

export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null })

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logged out successfully"))
})

export const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "User fetched"))
})
