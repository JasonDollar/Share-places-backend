const express = require('express')
const userController = require('../controllers/user-controller')

const router = express.Router()

router.get('/', userController.getUsers)

router.post('/signup', userController.createUser)
router.post('/login', userController.loginUser)

module.exports = router