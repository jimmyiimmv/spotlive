const express = require('express')
const mongoose = require('mongoose')
const Player = require('./models/player')
const playerRouter = require('./routes/players')
const methodOverride = require('method-override')
const app = express()

mongoose.connect('mongodb://localhost/blog', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  const players = await Player.find().sort({ createdAt: 'desc' })
  res.render('players/index', { players: players })
})

app.use('/players', playerRouter)

app.listen(5000)