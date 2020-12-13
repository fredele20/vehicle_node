const express = require('express')
const { validate, User } = require('../models/user')
const _ = require('lodash')
const router = express.Router()

router.post('/register', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).send('A user with the email already exist')

  user = new User(_.pick(req.body, ['name', 'surname', 'phone', 'email']))

  user = await user.save()

  res.send(_.pick(user, ['_id', 'name', 'email']))
})


module.exports = router