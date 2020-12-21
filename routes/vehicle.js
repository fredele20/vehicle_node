const express = require('express')
const { validate, Vehicle } = require('../models/vehicles')
const { auth } = require('../middlewares/auth')
const _ = require('lodash')
const router = express.Router()

// This is the route to register a new Vehicle
router.post('/', auth, async (req, res) => {

  // check if the user is an admin.
  if(!req.user.isAdmin) return res.status(403).json({ error: "Access denied, Forbidden" })

  // This is to validate the input fields
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // We don't like to register two vehicles with the same 
  // plate number, so we check if the plate number already exists 
  // with another vehicle.
  let vehicle = await Vehicle.findOne({ number: req.body.number })
  if (vehicle) return res.status(400).send('A vehicle with the given plate number already exists')

  // Here we use lodash to select the input fields that we want the
  // user to add in other to register the vehicle, without the ID
  vehicle = new Vehicle(_.pick(req.body, '_id', 'name', 'brand', 'number'))

  // This is used to save to the database
  vehicle = await vehicle.save()

  // We pick just the id and name upon successful registration,
  // to be sent to the user.
  res.send(_.pick(vehicle, ['_id', 'name']))
})

module.exports = router