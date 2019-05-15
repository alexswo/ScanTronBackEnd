const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require('uuid/v4');

const Course = require('../models/Course');
const TABLE_NAME = 'Exam';

const create = async (courseid, exam) => {
    const id = uuidv4();
    const params = {
        TableName: TABLE_NAME,
        Item: {
            id: id,
            name: exam.name,
            courseid: courseid,
            answers: exam.answers
        }
    };

    const result = await Course.updateExamList(courseid, id);
    return dynamoDb.put(params).promise();
}

const get = async (examid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id: examid }
    };
    const result = await dynamoDb.get(params).promise();
    return result.Item;
}

const getAll = async (courseid) => {
    const result = await Course.get(courseid);
    console.log(result);
    return Promise.all(result.examids.values.map(examid => {
        return get(examid);
    }));
}

const remove = async (examid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id: examid }
    };
    const result = await get(examid);
    await Course.deleteExam(result.courseid, examid);
    return dynamoDb.delete(params).promise();
}

const update = async (examid, exam) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id: examid },
        UpdateExpression: "SET name=:x",
        ExpressionAttributeValues: {
            ":x": exam.name
        }
    };
    return dynamoDb.update(params).promise();
}

const updateGradeList = async (examid, gradeid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id: examid },
        UpdateExpression: "ADD gradeids :x",
        ExpressionAttributeValues: {
            ":x": dynamoDb.createSet([gradeid])
        }
    };
    return dynamoDb.update(params).promise();
}

const deleteGrade = async (examid, gradeid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id: examid },
        UpdateExpression: "DELETE gradeids :x",
        ExpressionAttributeValues: {
            ":x": dynamoDb.createSet([gradeid])
        }
    };
    return dynamoDb.update(params).promise();
}



module.exports = { get, create, getAll, remove, update, updateGradeList, deleteGrade }