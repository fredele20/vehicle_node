const express = require('express')
const { OwnedVehicle } = require('../models/ownedVehicles')
const { Vehicle } = require('../models/vehicles')
const router = express.Router()


router.get('/', async (req, res) => {
  // const allVehicle = await Vehicle.findById(req.body.id)
  // console.log(allVehicle)

  

  // const ownedVehicles = await OwnedVehicle.findOne({ vehicleId: req.body. })
  // console.log(ownedVehicles)

  const ownedVehicle = await Vehicle.findById(req.body.vehicleId)

  const availabelVehicles = allVehicle - ownedVehicles
  console.log(availabelVehicles)
  res.send(availabelVehicles)
})

module.exports = router