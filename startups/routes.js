const express = require('express')
const user = require('../routes/user')
const vehicle = require('../routes/vehicle')


module.exports = function (app) {
  app.use(express.json())
  app.use("/api/users", user)
  app.use("/api/vehicle", vehicle)
}

