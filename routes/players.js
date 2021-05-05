const express = require('express')
const Player = require('./../models/player')
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('players/new', { player: new Player() })
})

router.get('/edit/:id', async (req, res) => {
  const player = await Player.findById(req.params.id)
  res.render('players/edit', { player: player })
})

router.get('/:slug', async (req, res) => {
  const player = await Player.findOne({ slug: req.params.slug })
  if (player == null) res.redirect('/')
  res.render('players/show', { player: player })
})

router.post('/', async (req, res, next) => {
  req.player = new Player()
  next()
}, savePlayerAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.player = await Player.findById(req.params.id)
  next()
}, savePlayerAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Player.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

function savePlayerAndRedirect(path) {
  return async (req, res) => {
    let player = req.player
    player.title = req.body.title
    player.description = req.body.description
    player.platform = req.body.platform
    player.markdown = req.body.markdown
    try {
      player = await player.save()
      res.redirect(`/players/${player.slug}`)
    } catch (e) {
      res.render(`players/${path}`, { player: player })
    }
  }
}

module.exports = router