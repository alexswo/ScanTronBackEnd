var express = require('express');
var router = express.Router();
var request = require('request');
var redis = require("redis");
var User = require('../models/User.js');

router.get('/:id', function (req, res, next) {
  const id = parseInt(req.params.id);

  client = redis.createClient();

  client.get(id, function (error, result) {
    if (error) {
      console.log(error)
    }

    // IDs are given as a string of the form "[id1, id2, id3]"
    ids = result.split(', ')
    ids[0] = ids[0].substring(1, ids[0].length)
    ids[ids.length-1] = ids[ids.length-1].substring(0, ids[ids.length-1].length - 1)

    /*chefs = new Array()

    ids.forEach(function(chefId) {
      User.find({id: chefId, chef : true}).then(eachOne => {
          chefs.push(eachOne)
      })
    })*/

    res.json(ids)
  })
});

module.exports = router;
