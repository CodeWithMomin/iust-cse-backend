import { Router } from "express"
import {
  register,
  login,
  logout,
  refreshAccessToken,
  getMe,
} from "../controllers/auth.controller.js"
import { protect } from "../middlewares/auth.middleware.js"
import { validate } from "../middlewares/validate.middleware.js"
import { registerSchema, loginSchema } from "../validations/auth.validation.js"

const router = Router()

router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)
router.post("/refresh-token", refreshAccessToken)
router.post("/logout", protect, logout)
router.get("/me", protect, getMe)

export default router
