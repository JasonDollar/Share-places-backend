const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: { 
    type: String, required: true
  },
  email: { 
    type: String, required: true, unique: true 
  },
  password: { 
    type: String, required: true, minlength: 6 
  },
  image: { 
    type: String, default: 'http://www.accountingweb.co.uk/sites/all/modules/custom/sm_pp_user_profile/img/default-user.png'
  },
  places: [
    { type: mongoose.Types.ObjectId, required: true, ref: 'Place' }
  ]
})


module.exports = mongoose.model('User', userSchema)
