const express = require('express')
const placeController = require('../controllers/place-controller')

const router = express.Router()

router.get('/', (req, res) => {
  res.json({message: 'It works'})
})

router.post('/', placeController.createPlace)

module.exports = router