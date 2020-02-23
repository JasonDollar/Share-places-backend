require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const placeRouter = require('./routes/places-routes')
const userRouter = require('./routes/user-routes')

const app = express()
app.use(express.json())

app.use('/api/places', placeRouter)
app.use('/api/users', userRouter)


mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true
})
  .then(() => console.log('db connected'))
  .catch(e => console.log(e))

  
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log('server started')
})