const User = require('../models/User')
const bcrypt = require('bcryptjs')

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 12)

  const newUser = new User({ name, email, password: hashedPassword })
  

  await newUser.save()

  res.status(201).json(newUser)
}