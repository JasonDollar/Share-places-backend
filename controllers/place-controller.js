const { validationResult } = require('express-validator')
const Place = require('../models/Place')
const HttpError = require('../models/http-error')

exports.createPlace = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422))
  }

  const {
    title, description, address, creator, location, image, 
  } = req.body

  const newPlace = new Place({ 
    title, description, address, creator, location, image, 
  })
  
  try {
    await newPlace.save()
  } catch (e) {
    return next(new HttpError(e.message, 500))
  }
  res.status(201).json({ place: newPlace })
}

exports.getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid

  try {
    const place = await Place.findById(placeId)

    if (!place) {
      return next(new HttpError('Could not find place for the provided id.', 404))
    }

    res.json({ place })

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
  try {
    const place = await Place.findById(placeId)

    if (!place) return next(new HttpError('Could not find the place', 404))

    if (title) place.title = title
    if (description) place.description = description

    await place.save()

    res.status(200).json({ place })
  } catch (e) {
    next(new HttpError(e.message, 500))
  }

}

exports.deletePlace = async (req, res, next) => {
  const placeId = req.params.pid
  try {
    const place = await Place.findByIdAndRemove(placeId)

    if (!place) return next(new HttpError('Could not find the place', 404))


    res.status(204).json({ place })
  } catch (e) {
    next(new HttpError(e.message, 500))
  }
}

exports.getPlacesByUserId = async (req, res, next) => {
  try {

    const userId = req.params.uid
    const places = await Place.find({ creator: userId })

    if (!places) {
      return next(new HttpError('Could not find places for that user.', 404))
    }

    res.status(200).json({ places })

  } catch (e) {
    res.json({ message: e.message })
  }
}