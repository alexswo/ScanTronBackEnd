const AWS = require('aws-sdk');

const uuidv4 = require('uuid/v4');

String.prototype.format = function () {
    a = this;
    for (k in arguments) {
        a = a.replace("{" + k + "}", arguments[k])
    }
    return a
}

const submit = async (credentials, examid, submission) => {
    // Parse the submission, and create multiple calls to s3
    const id = uuidv4();
    const key = 'submissions/userid={0}/examid={1}/{2}.jpg'.format(credentials.identityId, examid, id);
    const params = {
        Body: submission.buffer,
        Bucket: 'scantron-answer-sheets',
        Key: key,
        ContentType: 'image/jpeg'
    };
    const s3 = new AWS.S3({ credentials: credentials });
    await s3.putObject(params).promise();
}

module.exports = { submit } 
