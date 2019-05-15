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

const get = async (email, token) => {
    console.log("i am here");
    console.log(token);
    AWS.config.region = 'us-west-2';

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-west-2:1f1ce9c9-12c6-454b-ab5d-8116cd064b7d',
        Logins: {
            'cognito-idp.us-west-2.amazonaws.com/us-west-2_s8WJSeVMp': token
        }
    });
    return new Promise((resolve, reject) => {
        AWS.config.credentials.get(async (err) => {
            var id = AWS.config.credentials.identityId;
            console.log("MY ID");
            console.log(id);
            var params = {
                TableName: TABLE_NAME,
                Key: { email: id }
            };
            const dd = new AWS.DynamoDB.DocumentClient();
            const result = await dd.get(params).promise();
            console.log(result);
            return resolve(result.Item);
        });
    });


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