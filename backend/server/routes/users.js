var mongoose = require('mongoose');
mongoose.set('debug', true);
const User = require('../models/User.js');
const bcrypt = require('bcrypt');

var express = require('express');
var router = express.Router();

/**
 * GET list of all users.
 */
router.get('/', function(req, res, next) {
    User.find({chef : false}).then(eachOne => {
    res.json(eachOne);
    })
});

/**
 * GET events a user is hosting
 */

router.get('/events/:id', function (req, res, next) {
    User.findById( parseInt(req.params.id), function (err, user) {
       if (err) res.status(400).send();
       res.json(user.events);
   });
});

/**
 * GET all the reviews a user wrote
 */
router.get('/reviews/:id', function (req, res, next) {
    User.findById( parseInt(req.params.id), function (err, user) {
        if (err) res.status(400).send();
        res.json(user.outgoingReviews);
    });
});

/**
  * GET a user's description
  */
router.get('/description/:id', function (req, res, next) {
    User.findById( parseInt(req.params.id), function (err, user) {
        if (err) res.status(400).send();
        res.json(user.description);
    });
});

/**
  * GET a user's dishes
  */
router.get('/dishes/:id', function (req, res, next) {
    User.findById( parseInt(req.params.id), function (err, user) {
        if (err) res.status(400).send();
        res.json(user.dishes);
    });
});

/**
  * GET a user's tags
  */
router.get('/tags/:id', function (req, res, next) {
    User.findById( parseInt(req.params.id), function (err, user) {
        if (err) res.status(400).send();
        res.json(user.tags);
    });
});

/**
 * PUT: Update a user's password
 */
router.put('/password/:id', function(req, res, next) {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        if (err) {
            res.status(400).send();
        } else {
            User.findOneAndUpdate({ id: parseInt(req.params.id) }, { password: hash }, { new: true }, function (err, user) {
                if (err) res.status(400).send();
                res.json(user);
            });
        }
    });
});

/**
 * PUT: Update a user's description
 */
router.put('/description/:id', function(req, res, next) {
    User.findOneAndUpdate({ id: parseInt(req.params.id) }, { description: req.body.description }, { new: true }, function (err, user) {
        if (err) res.status(400).send();
        res.json(user);
    });
});

/**
 * PUT: Update a user's events
 */
router.put('/events/:id', function(req, res, next) {
    let evs = req.body.events;
    for (let i = 0; i < evs.length; i++) {
        evs[i].date = new Date(evs[i].time).toISOString().split('T')[0];
    }
    User.findOneAndUpdate({ id: parseInt(req.params.id) }, { events: evs }, { new: true }, function (err, user) {
        if (err) res.status(400).send();
        res.json(user);
    });
});

/**
 * PUT: Update a user's reviews
 */
router.put('/reviews/:id', function(req, res, next) {
    User.findOneAndUpdate({ id: parseInt(req.params.id) }, { outgoingReviews: req.body.reviews }, { new: true }, function (err, user) {
        if (err) res.status(400).send();
        res.json(user);
    });
});

/**
 * PUT: Update a user's dishes
 */
router.put('/dishes/:id', function(req, res, next) {
    User.findOneAndUpdate({ id: parseInt(req.params.id) }, { dishes: req.body.dishes }, { new: true }, function (err, user) {
        if (err) res.status(400).send();
        res.json(user);
    });
});

/**
 * PUT: Update a user's tags
 */
router.put('/tags/:id', function(req, res, next) {
    User.findOneAndUpdate({ id: parseInt(req.params.id) }, { tags: req.body.tags }, { new: true },function (err, user) {
        if (err) res.status(400).send();
        res.json(user);
    });
});

/**
 * PUT: Update a user's zipcode
 */
router.put('/zipcode/:id', function(req, res, next) {
    User.findOneAndUpdate( { id: parseInt(req.params.id) }, { zipcode: req.body.zipcode }, { new: true }, function (err, user) {
        if (err) res.status(400).send();
        res.json(user);
    });
});

module.exports = router;
