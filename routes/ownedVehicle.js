const express = require('express')
const { validate, OwnedVehicle } = require('../models/ownedVehicles')
const { User } = require('../models/user')
const { Vehicle } = require('../models/vehicles')
const router = express.Router()

router.post('/', async (req, res) => {

  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const user = await User.findById(req.body.userId)
  if (!user) return res.status(400).send('Invalid user')

  const vehicle = await Vehicle.findById(req.body.vehicleId)
  if (!vehicle) return res.status(400).send('Invalid vehicle, already taken')

  let ownedVehicle = new OwnedVehicle({
    vehicle: {
      _id: vehicle._id,
      name: vehicle.name
    },

    user: {
      _id: user._id,
      name: vehicle.name
    }
  })
})

module.exports = router