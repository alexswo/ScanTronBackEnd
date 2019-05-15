const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require('uuid/v4');

const User = require('../models/User');
const TABLE_NAME = 'Course';

const create = async (email, course) => {
    const id = uuidv4();
    const params = {
        TableName: TABLE_NAME,
        Item: {
            id: id,
            name: course.name,
            description: course.description
        }
    };

    const result = await User.updateCourseList(email, id);
    return dynamoDb.put(params).promise();
}

const get = async (courseid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id: courseid }
    };
    const result = await dynamoDb.get(params).promise();
    return result.Item;
}

const getAll = async (email) => {
    const result = await User.get(email);
    console.log(result);
    return Promise.all(result.courseids.values.map(courseid => {
        return get(courseid);
    }));
}

const remove = async (email, courseid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id: courseid }
    };
    const result = await User.deleteCourse(email, courseid);
    return dynamoDb.delete(params).promise();
}

const update = async (courseid, course) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id: courseid },
        UpdateExpression: "SET name=:x, description=:y",
        ExpressionAttributeValues: {
            ":x": course.name,
            ":y": course.description
        }
    };

    return dynamoDb.update(params).promise();
}

const updateExamList = async (courseid, examid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id: courseid },
        UpdateExpression: "ADD examids :x",
        ExpressionAttributeValues: {
            ":x": dynamoDb.createSet([examid])
        }
    };
    return dynamoDb.update(params).promise();
}


const deleteExam = async (courseid, examid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id: courseid },
        UpdateExpression: "DELETE examids :x",
        ExpressionAttributeValues: {
            ":x": dynamoDb.createSet([examid])
        }
    };
    return dynamoDb.update(params).promise();
}

module.exports = { get, create, getAll, remove, update, updateExamList, deleteExam }