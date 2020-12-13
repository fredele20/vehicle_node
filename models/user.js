const mongoose = require('mongoose')
const Joi = require('joi')


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    minlength: 3,
    maxlength: 255
  },

  surname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },

  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },

  phone: {
    type: String,
    required: true
  }
})

userSchema.methods.generateAuthToken = function() {}

function validateUser(user) {
  const schema = {
    name: Joi.string().min(3).required(),
    surname: Joi.string().min(3).required(),
    email: Joi.string().min(5).required().email(),
    phone: Joi.string().required()
  }
  return Joi.validate(user, schema)
}

const User = mongoose.model('User', userSchema)

exports.userSchema = userSchema
exports.User = User
exports.validate = validateUser