const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const HttpError = require('../models/http-error')

exports.createUser = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422))
  }
  
  const { name, email, password } = req.body

  let existingUser
  try {
    existingUser = await User.findOne({ email })

  } catch {
    const error = new HttpError('Signing up failed, please try again later', 500)
    return next(error)
  }

  if (existingUser) {
    const error = new HttpError('User exists lready, please log in insted', 422)
    return next(error)
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const newUser = new User({
    name, email, password: hashedPassword, places: [], 
  })

  try {
    await newUser.save()
  } catch (e) {
    const error = new HttpError(
      e.message,
      500,
    )
    return next(error)
  }

  
  let token
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    )
  } catch (e) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500,
    )
    return next(error)
  }
  
  res.status(201).json({
    userId: newUser.id, 
    email: newUser.email,
    token, 
  })

}

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body

  let existingUser

  try {
    existingUser = await User.findOne({ email })
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500,
    )
    return next(error)
  }

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403,
    )
    return next(error)
  }

  let isValidPassword = false
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password)
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500,
    )
    return next(error)
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403,
    )
    return next(error)
  }

  let token
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    )
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500,
    )
    return next(error)
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token,
  })
}

exports.getUsers = async (req, res, next) => {
  let users
  try {
    users = await User.find({}, '-password')
  
  } catch {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500,
    )
    return next(error)
  }
  res.json(users.map(item => item.toObject({ getters: true })))
}