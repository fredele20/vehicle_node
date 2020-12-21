const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('config')
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

  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },

  phone: {
    type: String,
    required: true
  },

  location: {
    longitude: {
      type: String
    },
    latitude: {
      type: String
    }
  },

  isAdmin: {
    type: Boolean,
    default: false
  }
})

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get('jwtPrivateKey')
  )
  return token
}

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

function validateUser(user) {
  const schema = {
    name: Joi.string().min(3).required(),
    surname: Joi.string().min(3).required(),
    email: Joi.string().min(5).required().email(),
    phone: Joi.string().required(),
    password: Joi.string().min(5).max(255).required()
  }
  return Joi.validate(user, schema)
}

function validateLogin(login) {
  const schema = {
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required()
  }
  return Joi.validate(login, schema)
}

const User = mongoose.model('User', userSchema)

exports.userSchema = userSchema
exports.User = User
exports.validateLogin = validateLogin
exports.validate = validateUser