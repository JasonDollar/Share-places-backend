const Place = require('../models/Place')
const HttpError = require('../models/http-error')

exports.createPlace = async (req, res) => {
  const { title, description, address, creator, location, image } = req.body

  const newPlace = new Place({title, description, address, creator, location, image})
  await newPlace.save()
  res.json(newPlace)
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
    res.json({message: e.message})
  }
}

exports.getPlacesByUserId = async (req, res, next) => {
  try {

    const userId = req.params.uid
    const places = await Place.find({ creator: userId })

    if (!places) {
      return next(new HttpError('Could not find places for that user.', 404))
    }

    res.status(200).json(places)

  } catch (e) {
    res.json({ message: e.message })
  }
}