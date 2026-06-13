import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { verifyAccessToken } from "../utils/tokens.js"
import User from "../models/user.model.js"

export const protect = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.headers.authorization?.replace("Bearer ", "")

  if (!token) throw new ApiError(401, "Unauthorized - no token provided")

  const decoded = verifyAccessToken(token)
  const user = await User.findById(decoded._id)
  if (!user) throw new ApiError(401, "Unauthorized - user not found")

  req.user = user
  next()
})

export const restrictTo = (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden - insufficient permissions"))
    }
    next()
  }
