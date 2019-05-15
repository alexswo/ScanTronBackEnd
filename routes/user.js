var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Authentication = require('../models/Authentication')

// Get user information
router.get('/:email', Authentication.validate, async (req, res) => {

    if (req.params.email) {
        try {
            const result = await User.get(req.params.email);
            res.json(result);
        } catch (err) {
            res.status(400);
            res.json(err);
        }
    } else {
        res.status(400);
        return res.send("Query requires email");
    }
});

// Update user information (i.e. school, first name, last name)
router.put('/:email', Authentication.validate, async (req, res) => {
    if (req.params.email) {
        try {
            const result = await User.updateInfo(req.body);
            res.json(result);
        } catch (err) {
            res.status(400);
            res.json(err);
        }

    } else {
        res.status(400);
        return res.send("Query requires email");
    }
});
module.exports = router;