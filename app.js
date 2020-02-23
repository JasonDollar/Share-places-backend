const express = require('express')
const placeRouter = require('./routes/places-routes')

const app = express()

app.use('/', placeRouter)

app.listen(5000)