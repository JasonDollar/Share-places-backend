const Place = require('../models/Place')

exports.createPlace = async (req, res) => {
  const { title, description, address, creator, location, image } = req.body

  const newPlace = new Place({title, description, address, creator, location, image})
  await newPlace.save()
  res.json(newPlace)
}