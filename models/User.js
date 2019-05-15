const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "User";
const create = async (user) => {
    var params = {
        TableName: TABLE_NAME,
        Item: {
            email: user.email,
            school: user.school,
            firstName: user.firstName,
            lastName: user.lastName
        }
    };
    return dynamoDb.put(params).promise();
}

const get = async (email) => {
    var params = {
        TableName: TABLE_NAME,
        Key: { email: email }
    };
    const result = await dynamoDb.get(params).promise();
    return result.Item;
}

const updateInfo = async (user) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { email: user.email },
        UpdateExpression: "SET school=:x, firstName=:y, lastName=:z",
        ExpressionAttributeValues: {
            ":x": user.school,
            ":y": user.firstName,
            ":z": user.lastName
        }
    };

    return dynamoDb.update(params).promise();
}

const updateCourseList = async (email, courseid) => {

    const params = {
        TableName: TABLE_NAME,
        Key: { email: email },
        UpdateExpression: "ADD courseids :x",
        ExpressionAttributeValues: {
            ":x": dynamoDb.createSet([courseid])
        }
    };
    return dynamoDb.update(params).promise();
}

const deleteCourse = async (email, courseid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { email: email },
        UpdateExpression: "DELETE courseids :x",
        ExpressionAttributeValues: {
            ":x": dynamoDb.createSet([courseid])
        }
    };
    return dynamoDb.update(params).promise();
}

module.exports = { create, get, updateInfo, updateCourseList, deleteCourse }