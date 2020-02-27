const express = require('express')
const { check } = require('express-validator')
const userController = require('../controllers/user-controller')

const router = express.Router()

router.get('/', userController.getUsers)

router.post(
  '/signup', 
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 }),
  ], 
  userController.createUser,
)

router.post('/login', userController.loginUser)

module.exports = router