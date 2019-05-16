var express = require('express');
var router = express.Router();
var Exam = require('../models/Exam');
var Authentication = require('../models/Authentication')

router.get('/:email/:examid', Authentication.validate, Authentication.getCredentials, async (req, res) => {
    try {
        const result = await Exam.get(res.locals.credentials, req.params.examid);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
});

router.get('/:email/:courseid/all', Authentication.validate, Authentication.getCredentials, async (req, res) => {
    try {
        const result = await Exam.getAll(res.locals.credentials, req.params.courseid);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
});

router.post('/:email/:courseid', Authentication.validate, Authentication.getCredentials, async (req, res) => {
    // Must have exam name and exam answers
    if (req.body.name && req.body.answers) {
        try {
            const examid = await Exam.create(res.locals.credentials, req.params.courseid, req.body);
            res.json({ examid: examid });
        } catch (err) {
            res.status(400);
            res.json(err);
        }
    } else {
        res.status(400);
        return res.send("Query requires exam name and exam answers");
    }
});

router.delete('/:email/:examid/', Authentication.validate, Authentication.getCredentials, async (req, res) => {
    try {
        const result = await Exam.remove(res.locals.credentials, req.params.examid);
        res.json(result);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
});

router.put('/:email/:examid', Authentication.validate, Authentication.getCredentials, async (req, res) => {
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