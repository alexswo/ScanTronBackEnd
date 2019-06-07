const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require('uuid/v4');

const Exam = require('../models/Exam');
const TABLE_NAME = 'Grade';

const create = async (credentials, examid, grade) => {
    const id = uuidv4();
    const params = {
        TableName: TABLE_NAME,
        Item: {
            userid: credentials.identityId,
            studentid: grade.studentid,
            gradeid: id,
            examid: examid,
            score: grade.score,
            graded_url: grade.graded_url,
            raw_url: grade.raw_url
        }
    };

    await Exam.updateGradeList(credentials, examid, id);
    const dd = new AWS.DynamoDB.DocumentClient({ credentials: credentials });
    await dd.put(params).promise();
    return id;
}

const get = async (credentials, gradeid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            userid: credentials.identityId,
            gradeid: gradeid
        }
    };
    const dd = new AWS.DynamoDB.DocumentClient({ credentials: credentials });
    const result = await dd.get(params).promise();
    return result.Item;
}

const getAll = async (credentials, examid) => {
    const result = await Exam.get(credentials, examid);
    console.log(result);
    if (result && result.gradeids) {
        return Promise.all(result.gradeids.values.map(gradeid => {
            return get(credentials, gradeid);
        }));
    }
    return Promise.resolve([]);

}

const remove = async (credentials, gradeid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            userid: credentials.identityId,
            gradeid: gradeid
        }
    };
    const result = await get(credentials, gradeid);
    await Exam.deleteGrade(credentials, result.examid, gradeid);
    const dd = new AWS.DynamoDB.DocumentClient({ credentials: credentials });
    return dd.delete(params).promise();
}

const update = async (credentials, gradeid, grade) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            userid: credentials.identityId,
            gradeid: gradeid
        },
        UpdateExpression: "SET score=:x",
        ExpressionAttributeValues: {
            ":x": grade.score
        }
    };
    const dd = new AWS.DynamoDB.DocumentClient({ credentials: credentials });
    return dd.update(params).promise();
}

module.exports = { get, create, getAll, remove, update }