if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const Player = require('./models/player')
const playerRouter = require('./routes/players')
const userRouter = require('./routes/users')
const methodOverride = require('method-override')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require('./passport-config')
initializePassport(
  passport, 
  email => User.find(User => User.email === email),
  id => User.find(User => User.id === id)
)

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to mongoose'))

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(flash())
app.use(session({
  secret: 'secret',
  resave: false, 
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkNotAuthenticated, async (req, res) => {
  const players = await Player.find().sort({ createdAt: 'desc' })
  res.render('players/index', { players: players})
})

app.get('/home', checkAuthenticated, async (req, res) => {
  const players = await Player.find().sort({ createdAt: 'desc' })
  res.render('players/home', {players: players, name: req.user.name})
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('players/login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('players/register.ejs')
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

app.use('/players', playerRouter)
app.use('/users', userRouter)

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/home')
  }
  next()
}

app.listen(process.env.PORT || 5000)