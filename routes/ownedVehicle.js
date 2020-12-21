const express = require('express')
const mongoose = require('mongoose')
const { validate, OwnedVehicle } = require('../models/ownedVehicles')
const { User } = require('../models/user')
const { Vehicle } = require('../models/vehicles')
const { auth } = require('../middlewares/auth')
const router = express.Router()

// This route is to acquire and own a vehicle,
// A vehicle that is already owned by another user
// can no longer be available for ownership.
router.post('/', auth,  async (req, res) => {

  // This line is used to validate the request body.
  // i.e the necessary input fields
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // This is to find a user from the User collection
  const user = await User.findById(req.body.userId)
  if (!user) return res.status(400).send('Invalid user')

  // This is to find a vehicle from the Vehicle collection
  let vehicle = await Vehicle.findById(req.body.vehicleId)
  if (!vehicle) return res.status(400).send('Invalid request')

  // This is to check if the vehicle is already owned by any of the users
  // If so, it will not execute the next command
  vehicle = await Vehicle.findOne({ isOwned: false })
  if (!vehicle) return res.status(400).send("This vehicle is already owned by another person")

  // This is the main code that registers a vehicle for ownership
  // The required field to add.
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

  // This is to save into the database
  ownedVehicle = await ownedVehicle.save()

  // After successfully saving into the OwnedVehicle collection,
  // the vehicle that is owned is updated inside the Vehicle collection,
  // the isOwned property is set to true.
  vehicle = await Vehicle.findByIdAndUpdate(req.body.vehicleId, {$set:{ isOwned: true }})

  res.send(ownedVehicle)
})

// This route get all the Vehicle that are already owned by any user (occupied vehicles)
router.get("/", auth, async(req, res) => {
  // This line is getting all owned vehicle from the OwnedVehicle collection
  const ownedVehicle = await OwnedVehicle.find()
  res.send(ownedVehicle)
})

// this route get all the vehicles own by a particular user
router.get("/:id", auth, async(req, res) => {

  // This is a constant to help check if the ObjectId is valid later.
  const tryValid = mongoose.Types.ObjectId.isValid(req.params.id)

  let user;

  // Checks if the ObjectId is valid and get the required vehicle owned if valid.
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