var express = require('express');
var router = express.Router();
var User = require('../models/User.js');

//POST route for logging in
router.post('/', function (req, res, next) {
  if (req.body.Email && req.body.Password) {
    User.authenticate(req.body.Email, req.body.Password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.json({auth: true, user: user});
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
});

// GET route after registering
router.get('/', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        return user;
      }
    });
});

module.exports = router;
