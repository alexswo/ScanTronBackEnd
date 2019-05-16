var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Authentication = require('../models/Authentication')

// Get user information
router.get('/:email', Authentication.validate, Authentication.getCredentials, async (req, res) => {

    try {
        const result = await User.get(res.locals.credentials);
        console.log(result);
        res.json(result);
    } catch (err) {
        // console.log(err);
        res.status(400);
        res.json(err);
    }

});

// Update user information (i.e. school, first name, last name)
router.put('/:email', Authentication.validate, Authentication.getCredentials, async (req, res) => {

    try {
        const result = await User.updateInfo(res.locals.credentials, req.body);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json(err);
    }

});
module.exports = router;