class HttpError extends Error {
  constructor(message, errorCode) {
    super(message) // => new Error(message)
    this.code = errorCode
  }
}

module.exports = HttpError