var mongoose = require('mongoose');
mongoose.set('debug', true);
const Dish = require('../models/Dish.js');

var express = require('express');
var router = express.Router();

/* GET events listing. */
router.get('/', function(req, res, next) {
    Dish.find({}).then(eachOne => {
    res.json(eachOne);
    })
});

module.exports = router;
