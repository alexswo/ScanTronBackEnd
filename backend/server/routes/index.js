var express = require('express');
var AWS = require('aws-sdk');
var router = express.Router();
var dynamoDb = new AWS.DynamoDB.DocumentClient();

/* GET home page. */
router.get('/', function (req, res, next) {
  var params = {
    TableName: 'mytablename',
    Item: {
      mytablenamekey: 'mybeautifulkey',
      name: 'alexoh' // your icecream name
    }
  }
  console.log("Hellloo");
  res.render('index', { title: 'Hello' });
  console.log(dynamoDb.put(params).promise()); // returns dynamo result 

});

module.exports = router;
