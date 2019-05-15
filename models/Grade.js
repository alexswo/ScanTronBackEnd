const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require('uuid/v4');

const Exam = require('../models/Exam');
const TABLE_NAME = 'Grade';

const create = async (examid, grade) => {
    const id = uuidv4();
    const params = {
        TableName: TABLE_NAME,
        Item: {
            id: id,
            examid: examid,
            score: grade.score,
            graded_url: grade.graded_url,
            raw_url: grade.raw_url
        }
    };

    const result = await Exam.updateGradeList(courseid, id);
    return dynamoDb.put(params).promise();
}

const get = async (gradeid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id: gradeid }
    };
    const result = await dynamoDb.get(params).promise();
    return result.Item;
}

const getAll = async (examid) => {
    const result = await Exam.get(examid);
    console.log(result);
    return Promise.all(result.gradeids.values.map(gradeid => {
        return get(gradeid);
    }));
}

const remove = async (gradeid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id: gradeid }
    };
    const result = await get(gradeid);
    await Exam.deleteGrade(result.examid, gradeid);
    return dynamoDb.delete(params).promise();
}

const update = async (gradeid, grade) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id: gradeid },
        UpdateExpression: "SET score=:x",
        ExpressionAttributeValues: {
            ":x": grade.score
        }
    };
    return dynamoDb.update(params).promise();
}

module.exports = { get, create, getAll, remove, update }