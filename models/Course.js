const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require('uuid/v4');

const User = require('../models/User');
const TABLE_NAME = 'Course';

const create = async (credentials, course) => {
    const id = uuidv4();
    const params = {
        TableName: TABLE_NAME,
        Item: {
            userid: credentials.identityId,
            courseid: id,
            name: course.name,
            description: course.description
        }
    };

    await User.updateCourseList(credentials, id);
    const dd = new AWS.DynamoDB.DocumentClient({ credentials: credentials });
    await dd.put(params).promise();
    return id;
}

const get = async (credentials, courseid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            userid: credentials.identityId,
            courseid: courseid
        }
    };
    const dd = new AWS.DynamoDB.DocumentClient({ credentials: credentials });
    const result = await dd.get(params).promise();
    return result.Item;
}

const getAll = async (credentials) => {
    const result = await User.get(credentials);
    console.log(result);
    return Promise.all(result.courseids.values.map(courseid => {
        return get(credentials, courseid);
    }));
}

const remove = async (credentials, courseid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            userid: credentials.identityId,
            courseid: courseid
        }
    };
    await User.deleteCourse(credentials, courseid);
    const dd = new AWS.DynamoDB.DocumentClient({ credentials: credentials });
    return dd.delete(params).promise();
}

const update = async (credentials, courseid, course) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            userid: credentials.identityId,
            courseid: courseid
        },
        UpdateExpression: "SET #name=:x, description=:y",
        ExpressionAttributeNames: {
            "#name": "name"
        },
        ExpressionAttributeValues: {
            ":x": course.name,
            ":y": course.description
        }
    };
    const dd = new AWS.DynamoDB.DocumentClient({ credentials: credentials });
    return dd.update(params).promise();
}

const updateExamList = async (credentials, courseid, examid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            userid: credentials.identityId,
            courseid: courseid
        },
        UpdateExpression: "ADD examids :x",
        ExpressionAttributeValues: {
            ":x": dynamoDb.createSet([examid])
        }
    };
    const dd = new AWS.DynamoDB.DocumentClient({ credentials: credentials });
    return dd.update(params).promise();
}

const deleteExam = async (credentials, courseid, examid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            userid: credentials.identityId,
            courseid: courseid
        },
        UpdateExpression: "DELETE examids :x",
        ExpressionAttributeValues: {
            ":x": dynamoDb.createSet([examid])
        }
    };
    const dd = new AWS.DynamoDB.DocumentClient({ credentials: credentials });
    return dd.update(params).promise();
}

module.exports = { get, create, getAll, remove, update, updateExamList, deleteExam }