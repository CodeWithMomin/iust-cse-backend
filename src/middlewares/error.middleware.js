import { ApiError } from "../utils/ApiError.js"
import { logger } from "../utils/logger.js"

const errorHandler = (err, req, res, next) => {
  let error = err

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500
    const message = error.message || "Internal Server Error"
    error = new ApiError(statusCode, message, [], err.stack)
  }

  logger.error(`${error.statusCode} - ${error.message} - ${req.originalUrl}`)

  return res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  })
}

export default errorHandler
