var express = require('express');
var router = express.Router();
var Course = require('../models/Course');
var Authentication = require('../models/Authentication')

router.get('/:email/:courseid', Authentication.validate, async (req, res) => {
    try {
        const result = await Course.get(req.params.courseid);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
});

router.get('/:email', Authentication.validate, async (req, res) => {
    try {
        const result = await Course.getAll(req.params.email);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
});

router.post('/:email', Authentication.validate, async (req, res) => {
    // Must have course name and course description in the body
    if (req.body.name && req.body.description) {
        try {
            const result = await Course.create(req.params.email, req.body);
            res.json(result);
        } catch (err) {
            res.status(400);
            res.json(err);
        }
    } else {
        res.status(400);
        return res.send("Query requires course name and course description");
    }
});

router.delete('/:email/:courseid', Authentication.validate, async (req, res) => {
    try {
        const result = await Course.remove(req.params.email, req.params.courseid);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
});

router.put('/:email/:courseid', Authentication.validate, async (req, res) => {
    if (req.body.name && req.body.description) {
        try {
            const result = await Course.update(courseid, req.body);
            res.json(result);
        } catch (err) {
            res.status(400);
            res.json(err);
        }
    } else {
        res.status(400);
        return res.send("Query requires course name and course description");
    }
});

module.exports = router;