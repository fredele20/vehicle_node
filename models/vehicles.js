const mongoose = require('mongoose')
const Joi = require('joi')

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a vehicle name']
  },

  brand: {
    type: String,
    required: [true, 'Please add a the brand name of vehicle']
  },

  number: {
    type: String,
    required: [true, 'Please add the vehicle plate number']
  },

  isOwned: {
    type: Boolean,
    default: false
  }

})

const Vehicle = mongoose.model('Vehicle', vehicleSchema)

function validateVehicle(vehicle) {
  const schema = {
    name: Joi.string().required(),
    brand: Joi.string().required(),
    number: Joi.string().required()
  }
  return Joi.validate(vehicle, schema)
}

exports.Vehicle = Vehicle
exports.vehicleSchema = vehicleSchema
exports.validate = validateVehicle