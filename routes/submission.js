const express = require('express');
const multer = require('multer');
const router = express.Router();
const Submission = require('../models/Submission');
const Authentication = require('../models/Authentication')

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

router.post('/:email/:examid', Authentication.validate, Authentication.getCredentials, async (req, res) => {
    // Must have email and examid
    if (req.body.cropped_image && req.body.uncropped_image) {
        try {
            const result = await Submission.submit(res.locals.credentials, req.params.examid, req.body);
            console.log(result);
            res.json(result);
        } catch (err) {
            console.log(err);
            res.status(400);
            res.send(err);
        }
    } else {
        console.log("Query requires submission file");
        res.status(400);
        return res.send("Query requires submission file");
    }
});

module.exports = router;