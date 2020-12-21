const express = require('express')
const { validate, User, validateLogin } = require('../models/user')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const router = express.Router()


// Register route for registering a new user.
router.post('/register', async (req, res) => {
  // Validates the request body and returns error if any
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // Checks if a user with the email address is already existing
  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).send('A user with the email already exist')

  // creates a new instance of user object and adds the required fields
  user = new User(_.pick(req.body, ['name', 'surname', 'phone', 'email', 'password']))

  // Salt and Hash the user password before storing into the database
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)

  // Save the user to database
  user = await user.save()

  // Generate token from request header
  const token = user.generateAuthToken()

  res
    .header("authorization", token)
    .send(_.pick(user, ['_id', 'name', 'email']))
    .send(token)
})

router.post('/login', async(req, res) => {
  // Validate the request body for login details
  const { error } = validateLogin(req.body)
  if (error) return res.status(400).send(error.details[0].message);

  // Validate the email if it is correct or not
  let user = await User.findOne({ email: req.body.email })
  if (!user) res.status(400).json({ error: "Invalid email or password" })

  // Validate password
  const validPassword = await user.matchPassword(req.body.password)
  if (!validPassword) res.status(400).json({ error: "Invalid email or password" })

  // generate auth token and send
  const token = user.generateAuthToken()
  res.send(token)
})

module.exports = router