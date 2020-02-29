require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const placeRouter = require('./routes/places-routes')
const userRouter = require('./routes/user-routes')
const HttpError = require('./models/http-error')


const app = express()

const dev = process.env.NODE_ENV !== 'production'
app.use(cors({
  origin: dev ? 'http://localhost:3000' : process.env.PRODUCTION_URL,
  credentials: true,
}))

app.use(express.json())

app.use('/api/places', placeRouter)
app.use('/api/users', userRouter)

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route', 404)
  next(error)
})

app.use((error, req, res, next) => {
  if (req.headersSent) {
    return next(error)
  }
  res.status(error.code || 500)
    .json({ message: error.message || 'An unknown error occured' })
})


mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true,
})
  .then(() => console.log('db connected'))
  .catch(e => console.log(e))

  
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log('server started')
})