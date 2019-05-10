var mongoose = require('mongoose');
mongoose.set('debug', true);
const Event = require('../models/Event.js');

var express = require('express');
var router = express.Router();

/* GET events listing. */
router.get('/', function (req, res, next) {
  console.log("Hellloo");
  res.render('index', { title: 'HERRRROOO' });
});

/**
 * POST new event.
 */
router.post('/', function (req, res, next) {
  givenEvent = new Event({
    title: req.body.Title,
    time: req.body.Time,
    tags: req.body.Tags,
    host: req.body.Host,
    chefs: req.body.Chefs,
    dishes: req.body.Dishes,
  });

  if (req.body.Title && req.body.Host) {
    givenEvent.save(function (err, event) {
      if (err) {
        return next(err);
      } else {
        return res.json(event);
      }
    });
  }
});

module.exports = router;
