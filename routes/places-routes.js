const express = require('express')
const { check } = require('express-validator')
const placeController = require('../controllers/place-controller')
const checkAuth = require('../middleware/check-auth')

const router = express.Router()


router.get('/user/:uid', placeController.getPlacesByUserId)

router.get('/:pid', placeController.getPlaceById)

router.use(checkAuth)

router.delete('/:pid', placeController.deletePlace)
router.patch(
  '/:pid', 
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
  ],
  placeController.updatePlaceById,
)


router.post(
  '/', 
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty(),
  ], 
  placeController.createPlace,
)

module.exports = router