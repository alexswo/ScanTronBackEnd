var express = require('express');
var router = express.Router();
var Exam = require('../models/Exam');
var Authentication = require('../models/Authentication')

router.get('/:email/:examid', Authentication.validate, async (req, res) => {
    try {
        const result = await Exam.get(req.params.examid);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
});

router.get('/:email/:courseid', Authentication.validate, async (req, res) => {
    try {
        const result = await Exam.getAll(req.params.courseid);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
});

router.post('/:email/:courseid', Authentication.validate, async (req, res) => {
    // Must have exam name and exam answers
    if (req.body.name && req.body.answers) {
        try {
            const result = await Exam.create(req.params.courseid, req.body);
            res.json(result);
        } catch (err) {
            res.status(400);
            res.json(err);
        }
    } else {
        res.status(400);
        return res.send("Query requires exam name and exam answers");
    }
});

router.delete('/:email/:examid/', Authentication.validate, async (req, res) => {
    try {
        const result = await Exam.remove(req.params.examid);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
});

router.put('/:email/:examid', Authentication.validate, async (req, res) => {
    if (req.body.name) {
        try {
            const result = await Exam.update(examid, req.body);
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