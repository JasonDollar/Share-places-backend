const Place = require('../models/Place')

exports.createPlace = async (req, res) => {
  const { title, description, address, creator, location, image } = req.body

  const newPlace = new Place({title, description, address, creator, location, image})
  await newPlace.save()
  res.json(newPlace)
}

exports.getPlaceById = async (req, res) => {
  const placeId = req.params.pid

  try {
    const place = await Place.findById(placeId)

    if (!place) {
      return res.status(404).json({message: 'Could not find place for the provided id.'})
    }

    res.json({ place })

  } catch (e) {
    res.json({message: e.message})
  }
}