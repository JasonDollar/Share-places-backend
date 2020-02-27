const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const Place = require('../models/Place')
const User = require('../models/User')
const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../util/location')

exports.createPlace = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422))
  }

  const {
    title, description, address, image, 
  } = req.body
  
  let location
  try {
    location = await getCoordsForAddress(address)
  } catch (e) {
    return next(e)
  }

  const newPlace = new Place({ 
    title, 
    description,
    address, 
    creator: req.userData.userId,
    location,
    image, 
  })

  let user
  try {
    user = await User.findById(req.userData.userId)
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, please try again.',
      500,
    )
    return next(error)
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404)
    return next(error)
  }
  
  try {
    const sess = await mongoose.startSession()
    sess.startTransaction()
    await newPlace.save({ session: sess })
    user.places.push(newPlace)
    await user.save({ session: sess })
    await sess.commitTransaction()
  } catch (e) {
    return next(new HttpError(e.message, 500))
  }
  res.status(201).json({ place: newPlace.toObject({ getters: true }) })
}

exports.getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid

  try {
    const place = await Place.findById(placeId)

    if (!place) {
      return next(new HttpError('Could not find place for the provided id.', 404))
    }

    res.json({ place: place.toObject({ getters: true }) })

  } catch (e) {
    res.json({ message: e.message })
  }
}

exports.updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422))
  }
  
  const placeId = req.params.pid
  const { title, description } = req.body

  let place
  try {
    place = await Place.findById(placeId)
  } catch {
    return next(new HttpError('Something went wrong, could not update place', 500))
  }

  if (!place) return next(new HttpError('Could not find the place', 404))

  place.title = title
  place.description = description

  try {
    await place.save()
  } catch (e) {
    return next(new HttpError('Something went wrong, could not update place', 500))
  }

  res.status(200).json({ place: place.toObject({ getters: true }) })
}

exports.deletePlace = async (req, res, next) => {
  const placeId = req.params.pid
  try {
    const place = await Place.findByIdAndRemove(placeId)

    
    if (!place) return next(new HttpError('Could not find the place', 404))

    res.status(204).json({ message: 'Place deleted succesfully' })
  } catch (e) {
    next(new HttpError(e.message, 500))
  }
}

exports.getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid
  let places
  try {
    places = await Place.find({ creator: userId })
  } catch {
    const error = new HttpError('Fetching places failed, try again later', 500)
    return next(error)
  }

  if (!places) {
    return next(new HttpError('Could not find places for that user.', 404))
  }

  res.status(200).json({ places: places.map(item => item.toObject({ getters: true })) })
}