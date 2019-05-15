var express = require('express');
var router = express.Router();
var Grade = require('../models/Grade');
var Authentication = require('../models/Authentication')

// Get a particular student exam
router.get('/:email/:gradeid', Authentication.validate, async (req, res) => {
    try {
        const result = await Grade.get(req.params.examid);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
});

// Get all of the student exams for a particular exam
router.get('/:email/:examid', Authentication.validate, async (req, res) => {
    try {
        const result = await Grade.getAll(req.params.examid);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
});

router.post('/:email/:examid', Authentication.validate, async (req, res) => {
    // Must have exam name and exam answers
    if (req.body.score && req.body.graded_url && req.body.raw_url) {
        try {
            const result = await Grade.create(req.params.examid, req.body);
            res.json(result);
        } catch (err) {
            res.status(400);
            res.json(err);
        }
    } else {
        res.status(400);
        return res.send("Query requires exam score, exam graded url, and exam raw url");
    }
});

router.delete('/:email/:gradeid/', Authentication.validate, async (req, res) => {
    try {
        const result = await Grade.remove(req.params.gradeid);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
});

router.put('/:email/:gradeid', Authentication.validate, async (req, res) => {
    if (req.body.score) {
        try {
            const result = await Grade.update(examid, req.body);
            res.json(result);
        } catch (err) {
            res.status(400);
            res.json(err);
        }
    } else {
        res.status(400);
        return res.send("Query requires course name");
    }
});

module.exports = router;