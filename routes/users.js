const express = require('express')
const User = require('./../models/users')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')

router.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    try {
      user = await user.save()
      res.redirect('/login')
    } catch (e) {
      console.log(e)
      res.redirect('/register')
    }
})

router.post('/login', (req, res) => {
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next)
})

module.exports = router