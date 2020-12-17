const express = require('express')
const { Vehicle } = require('../models/vehicles')
const router = express.Router()

// This route is used to get all the availabel vehicles.
router.get('/', async (req, res) => {

  // here, we find by the isOwned property in the Vehicle collection,
  // If it is not false, that means all the vehicle is owned by some users.
  const vehicle = await Vehicle.findOne({ isOwned: false })
  if (!vehicle) return res.status(404).send("No vehicle is available")

  // if there is any availabele vehicle, it is returned.
  res.send(vehicle)
})

module.exports = router