const config = require('config')
const jwt = require('jsonwebtoken')
const { User } = require('../models/user')

// function auth(req, res, next) {
//   const { authorization } = req.headers

//   if (!authorization) res.status(401).json({ error: "Access denied, no token provided" })

//   const token = authorization.replace("Bearer ", "")
//   jwt.verify(token, config.get("jwtPrivateKey"), (err, payload) => {
//     if (err) res.status(401).json({ error: "Invalid token" })

//     const { _id } = payload
//     User.findById(_id).then(userdata => {
//       req.user = userdata
//       next()
//     })
//   })
// }

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({error:  "Access denied. no token provided"});

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: "Invalid token" });
  }
}

exports.auth = auth