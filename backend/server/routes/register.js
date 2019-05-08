var express = require('express');
var router = express.Router();
var User = require('../models/User.js');

//POST route for updating data
router.post('/', function (req, res, next) {
    // confirm that user typed same password twice
    if (req.body.Password !== req.body.PasswordConf) {
        res.status(400);
        return res.send("Passwords do not match.");
    }

    if (req.body.name &&
        req.body.password &&
        req.body.passwordConf &&
        req.body.email &&
        req.body.zipcode) {

        User.count({}, function(err, count) {
            if (err) { return err; }

            var userData = {
                name: req.body.name,
                password: req.body.password,
                id: count,
                email: req.body.email,
                chef: req.body.chef,
                _id: count,
                zipcode: req.body.zipcode,
                description: req.body.description,
                dishes: req.body.dishes,
                tags: req.body.tags
            };

            User.create(userData, function (error, user) {
                if (error) {
                    res.status(400).send();
                } else {
                    req.session.userId = user._id;
                    res.json(user);
                }
            });
        })
    } else {
        res.status(400).send();
    }
});

module.exports = router;
