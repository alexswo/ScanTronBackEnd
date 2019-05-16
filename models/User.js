const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "User";
const create = async (credentials, user) => {
    var params = {
        TableName: TABLE_NAME,
        Item: {
            userid: credentials.identityId,
            email: user.email,
            school: user.school,
            firstName: user.firstName,
            lastName: user.lastName
        }
    };
    const dd = new AWS.DynamoDB.DocumentClient({ credentials: credentials });
    return dd.put(params).promise();
}

const get = async (credentials) => {

    // AWS.config.region = 'us-west-2';
    console.log(credentials.identityId);
    var params = {
        TableName: TABLE_NAME,
        Key: { userid: credentials.identityId }
    };
    const dd = new AWS.DynamoDB.DocumentClient({ credentials: credentials });
    const result = await dd.get(params).promise();
    return result.Item;
}

const updateInfo = async (credentials, user) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { userid: credentials.identityId },
        UpdateExpression: "SET school=:x, firstName=:y, lastName=:z",
        ExpressionAttributeValues: {
            ":x": user.school,
            ":y": user.firstName,
            ":z": user.lastName
        }
    };
    const dd = new AWS.DynamoDB.DocumentClient({ credentials: credentials });
    return dd.update(params).promise();
}

const updateCourseList = async (credentials, courseid) => {

    const params = {
        TableName: TABLE_NAME,
        Key: { userid: credentials.identityId },
        UpdateExpression: "ADD courseids :x",
        ExpressionAttributeValues: {
            ":x": dynamoDb.createSet([courseid])
        }
    };
    const dd = new AWS.DynamoDB.DocumentClient({ credentials: credentials });
    return dd.update(params).promise();
}

const deleteCourse = async (credentials, courseid) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { userid: credentials.identityId },
        UpdateExpression: "DELETE courseids :x",
        ExpressionAttributeValues: {
            ":x": dynamoDb.createSet([courseid])
        }
    };
    const dd = new AWS.DynamoDB.DocumentClient({ credentials: credentials });
    return dd.update(params).promise();
}

module.exports = { create, get, updateInfo, updateCourseList, deleteCourse }