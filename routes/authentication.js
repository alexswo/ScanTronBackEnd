var express = require('express');
var router = express.Router();
var Authentication = require('../models/Authentication.js');

const User = require('../models/User');

//Get route for logging in
router.get('/login', async (req, res) => {
    if (req.query.email && req.query.password) {
        try {
            // Get authentication stuff (includes jwt)
            const result = await Authentication.login(req.query);
            const token = result['idToken']['jwtToken'];

            // Obtain credentials to perform ANY api operation
            const credentials = await Authentication.getCred(token);

            // Get the user
            let user = await User.get(credentials);

            // If this is the first time user is logging in, will retrieve null object
            // Then create user info in dynamoDB
            if (!user) {
                const user = {
                    email: result.idToken.payload['email'],
                    firstName: result.idToken.payload['custom:first_name'],
                    lastName: result.idToken.payload['custom:last_name'],
                    school: result.idToken.payload['custom:school'],
                };
                await User.create(credentials, user);
            }
            res.cookie('jwt', token, { expires: 0, httpOnly: false });
            res.json(result);
        } catch (err) {
            console.log(err);
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
            const result = await Authentication.signUp(req.body);
            res.json(result);
        } catch (err) {
            // Authentication.remove(req.body);
            console.log(err);
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
