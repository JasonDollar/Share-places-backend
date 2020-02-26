const express = require('express')
const placeController = require('../controllers/place-controller')

const router = express.Router()


router.get('/user/:uid', placeController.getPlacesByUserId)

router.get('/:pid', placeController.getPlaceById)


router.post('/', placeController.createPlace)

module.exports = router