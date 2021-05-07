const express = require('express')
const User = require('./../models/users')
const router = express.Router()
const bcrypt = require('bcrypt')

router.post('/', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })
    try {
      user = await user.save()
      res.redirect('/login')
    } catch (e) {
      console.log(e)
      res.redirect('/register')
    }
})

module.exports = router