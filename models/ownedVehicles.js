const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')


const ownedVehicleSchema = new mongoose.Schema({
  vehicle: {
    type: new mongoose.Schema({
      name: {
        type:  String,
        require: true
      },
    }),
    required: true
  },

  user: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true
      }
    }),
    required: true
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },

  isDeleted: {
    type: Boolean,
    default: false
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