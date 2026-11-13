export class ApiError extends Error {
  statusCode: number
  errors?: unknown

  constructor(statusCode: number, message: string, errors?: unknown) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
    Object.setPrototypeOf(this, new.target.prototype)
  }

  static badRequest(msg: string, errors?: unknown) {
    return new ApiError(400, msg, errors)
  }

  static unauthorized(msg = 'Unauthorized') {
    return new ApiError(401, msg)
  }

  static forbidden(msg = 'Forbidden: Insufficient privileges') {
    return new ApiError(403, msg)
  }

  static notFound(msg = 'Resource not found') {
    return new ApiError(404, msg)
  }

  static conflict(msg = 'Conflict') {
    return new ApiError(409, msg)
  }

  static internal(msg = 'Internal server error') {
    return new ApiError(500, msg)
  }
}
