const Joi = require('joi')
const mongoose = require('mongoose')


const ownedVehicleSchema = new mongoose.Schema({
  vehicle: {
    type: new mongoose.Schema({
      name: String,
      require: true
    }),
    required: true
  },

  user: {
    type: new mongoose.Schema({
      name: String,
      require: true
    }),
    required
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },

  isDeleted: {
    type: Boolean
  }
})

ownedVehicleSchema.statics.lookup = function (vehicleId, userId) {
  return this.findOne({
    'vehicle._id': vehicleId,
    'user._id': userId
  })
}

function validateOwnedVehicle(ownedVehicle) {
  const schema = {
    vehicleId: Joi.objectId().required(),
    userId: Joi.objectId().required()
  }
  return Joi.validate(ownedVehicle, schema)
}

const OwnedVehicle = mongoose.model('OwnedVehicle', ownedVehicleSchema)

exports.OwnedVehicle = OwnedVehicle
exports.validate = validateOwnedVehicle