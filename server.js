if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const Player = require('./models/player')
const playerRouter = require('./routes/players')
const methodOverride = require('method-override')
const app = express()

const flash = require('express-flash')
const session = require('express-session')



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

app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  const players = await Player.find().sort({ createdAt: 'desc' })
  res.render('players/index', { players: players})
})

app.use('/players', playerRouter)


app.listen(process.env.PORT || 5000)