const express = require('express');
const multer = require('multer');
const router = express.Router();
const Submission = require('../models/Submission');
const Authentication = require('../models/Authentication')

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

router.post('/:email/:examid', upload.single('exam_image'), Authentication.validate, Authentication.getCredentials, async (req, res) => {
    // Must have email and examid
    if (req.file) {
        try {
            await Submission.submit(res.locals.credentials, req.params.examid, req.file);
            res.json();
        } catch (err) {
            console.log(err);
            res.status(400);
            res.send(err);
        }
    } else {
        res.status(400);
        return res.send("Query requires submission file");
    }
});

module.exports = router;