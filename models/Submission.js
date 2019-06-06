const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const S3_URL = 'scantron-answer-sheets.s3-us-west-2.amazonaws.com';
String.prototype.format = function () {
    a = this;
    for (k in arguments) {
        a = a.replace("{" + k + "}", arguments[k])
    }
    return a
}

const submit = async (credentials, examid, submission) => {
    // Parse the submission, and create multiple calls to s3

    submission = new Buffer(submission, 'base64')
    const id = uuidv4();
    const not_graded_key = 'not-graded/userid={0}/examid={1}/{2}.jpg'.format(credentials.identityId, examid, id);
    const graded_key = 'graded/userid={0}/examid={1}/{2}.jpg'.format(credentials.identityId, examid, id);
    const params = {
        Body: submission,
        Bucket: 'scantron-answer-sheets',
        Key: not_graded_key,
        ContentType: 'image/jpeg'
    };

    const not_graded_url = escape('{0}/{1}'.format(S3_URL, not_graded_key));
    const graded_url = escape('{0}/{1}'.format(S3_URL, graded_key));
    const s3 = new AWS.S3({ credentials: credentials });
    await s3.putObject(params).promise();

    return Promise.resolve({
        not_graded_url: not_graded_url,
        graded_url: graded_url
    });


}

module.exports = { submit } 
