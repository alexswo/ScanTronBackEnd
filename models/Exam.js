const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require('uuid/v4');

const Course = require('../models/Course');
const TABLE_NAME = 'Exam';

const create = async (credentials, courseid, exam) => {
    const id = uuidv4();
    const params = {
        TableName: TABLE_NAME,
        Item: {
            userid: credentials.identityId,
            examid: id,
            courseid: courseid,
            name: exam.name,
            answers: exam.answers
        }
    };

    await Course.updateExamList(credentials, courseid, id);
    const dd = new AWS.DynamoDB.DocumentClient({ credentials: credentials });
    await dd.put(params).promise();
    return id;
}

const get = async (credentials, examid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            userid: credentials.identityId,
            examid: examid
        }
    };
    const dd = new AWS.DynamoDB.DocumentClient({ credentials: credentials });
    const result = await dd.get(params).promise();
    return result.Item;
}

const getAll = async (credentials, courseid) => {
    const result = await Course.get(credentials, courseid);
    console.log(result);
    return Promise.all(result.examids.values.map(examid => {
        return get(credentials, examid);
    }));
}

const remove = async (credentials, examid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            userid: credentials.identityId,
            examid: examid
        }
    };
    const result = await get(credentials, examid);
    await Course.deleteExam(credentials, result.courseid, examid);
    const dd = new AWS.DynamoDB.DocumentClient({ credentials: credentials });
    return dd.delete(params).promise();
}

const update = async (credentials, examid, exam) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            userid: credentials.identityId,
            examid: examid
        },
        UpdateExpression: "SET name=:x",
        ExpressionAttributeValues: {
            ":x": exam.name
        }
    };
    const dd = new AWS.DynamoDB.DocumentClient({ credentials: credentials });
    return dd.update(params).promise();
}

const updateGradeList = async (credentials, examid, gradeid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            userid: credentials.identityId,
            examid: examid
        },
        UpdateExpression: "ADD gradeids :x",
        ExpressionAttributeValues: {
            ":x": dynamoDb.createSet([gradeid])
        }
    };
    const dd = new AWS.DynamoDB.DocumentClient({ credentials: credentials });
    return dd.update(params).promise();
}

const deleteGrade = async (credentials, examid, gradeid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            userid: credentials.identityId,
            examid: examid
        },
        UpdateExpression: "DELETE gradeids :x",
        ExpressionAttributeValues: {
            ":x": dynamoDb.createSet([gradeid])
        }
    };
    const dd = new AWS.DynamoDB.DocumentClient({ credentials: credentials });
    return dd.update(params).promise();
}

module.exports = { get, create, getAll, remove, update, updateGradeList, deleteGrade }