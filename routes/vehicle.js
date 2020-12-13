const express = require('express')
const { validate, Vehicle } = require('../models/vehicles')
const _ = require('lodash')
const router = express.Router()

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let vehicle = await Vehicle.findOne({ number: req.body.number })
  if (vehicle) return res.status(400).send('A vehicle with the given plate number already exists')

  vehicle = new Vehicle(_.pick(req.body, '_id', 'name', 'brand', 'number'))

  vehicle = await vehicle.save()

  // res.send(vehicle)
  res.send(_.pick(vehicle, ['_id', 'name']))
})

module.exports = router