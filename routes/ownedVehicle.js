const express = require('express')
const mongoose = require('mongoose')
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
  if (!vehicle) return res.status(400).send('Invalid request')

  let ownedVehicle = await OwnedVehicle.find({ "vehicle._id": req.body.id })
  if (ownedVehicle) return res.status(400).send('Invalid request, vehicle already taken')

  ownedVehicle = new OwnedVehicle({
    vehicle: {
      _id: vehicle._id,
      name: vehicle.name
    },

    user: {
      _id: user._id,
      name: user.name
    }
  })

  ownedVehicle = await ownedVehicle.save()
  res.send(ownedVehicle)
})

router.get("/", async(req, res) => {
  const ownedVehicle = await OwnedVehicle.find()
  res.send(ownedVehicle)
})

// this route get all the vehicles own by a particular user
router.get("/:id", async(req, res) => {

  const tryValid = mongoose.Types.ObjectId.isValid(req.params.id)
  let user;

  tryValid ? 
    res.send(user = await OwnedVehicle.find({ "user._id": req.params.id}))
    : res.status(404).send("No user with the given ID")

/** This code also works
 * if you don't understand the one above just uncomment the
 * if and else block and use it
 */

  // if (tryValid) {
  //   user = await OwnedVehicle.find({ "user._id": req.params.id })
  //   console.log(user)
  //   res.send(user)
  // } else {
  //   res.status(404).send("No user with the given ID")
  // }
  
})

module.exports = router