const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstname:{ type : String, required: true},
  lastname:String,
  email: { type: String, required: true, unique: true},
  phone: { type: String, required: true, unique: true},
  password: { type: String, required: true, minlength: 5 }
})
module.exports = User = mongoose.model('user', userSchema)
