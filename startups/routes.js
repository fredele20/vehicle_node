const express = require('express')
const user = require('../routes/user')
const vehicle = require('../routes/vehicle')
const ownedVehicle = require('../routes/ownedVehicle')


module.exports = function (app) {
  app.use(express.json())
  app.use("/api/users", user)
  app.use("/api/vehicle", vehicle)
  app.use("/api/owned_vehicle", ownedVehicle)
}

