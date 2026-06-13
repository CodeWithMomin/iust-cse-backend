import jwt from "jsonwebtoken"
import { config } from "../config/env.js"

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.accessTokenSecret, {
    expiresIn: config.accessTokenExpiry,
  })
}

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.refreshTokenSecret, {
    expiresIn: config.refreshTokenExpiry,
  })
}

export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.accessTokenSecret)
}

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.refreshTokenSecret)
}
