var express = require('express');
var router = express.Router();
var Authentication = require('../models/Authentication.js');



//Get route for logging in
router.get('/login', async (req, res) => {
    if (req.query.email && req.query.password) {
        try {
            const result = await Authentication.login(req.query);
            res.cookie('jwt', result['idToken']['jwtToken'], { expires: 0, httpOnly: false });
            res.json(result);
        } catch (err) {
            res.status(400);
            res.json(err);
        }
    } else {
        res.status(400);
        return res.send("Query requires email and password");
    }
});

//POST for registering
router.post('/register', async (req, res) => {
    // confirm that user typed same password twice

    if (req.body.password !== req.body.passwordConf) {
        res.status(400);
        return res.send("Passwords do not match.");
    }

    if (req.body.email && req.body.password && req.body.firstName && req.body.lastName && req.body.school) {
        try {
            const result = await Authentication.signup(req.body);
            res.json(result);
        } catch (err) {
            res.status(400);
            res.json(err);
        }

    } else {
        res.status(400);
        return res.send('All fields required');
    }
});

//POST route for updating data
router.post('/confirm', async (req, res) => {
    if (req.body.email && req.body.confirmCode) {
        try {
            const result = await Authentication.confirm(req.body);
            res.json(result);
        } catch (err) {
            res.status(400);
            res.json(err);
        }
    } else {
        res.status(400);
        return res.send('All fields required');
    }
});


module.exports = router;
