// server/models/User.js
// ('node-fetch required for amazon-cognito-identity-js to work
const request = require('request');
global.fetch = require('node-fetch')
const AWS = require('aws-sdk');
const AWSCognito = require('amazon-cognito-identity-js');

const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const USERPOOL_ID = "us-west-2_s8WJSeVMp";
const CLIENT_ID = "jvfgu20lplm1e0kcchhggesfg";
AWS.config.region = 'us-west-2';
const userPool = new AWSCognito.CognitoUserPool({
  UserPoolId: USERPOOL_ID,
  ClientId: CLIENT_ID,
  Paranoia: 8
});

const User = require('./User.js')

const signup = async (user) => {
  return new Promise((resolve, reject) => {
    userPool.signUp(user.email, user.password, null, null, (err, result) => {
      if (err) {
        console.log(err)
        reject(err);
      } else {
        User.create(user).then((result) => {
          resolve(result);
        }).catch((err) => {
          remove(user).then((result) => {
            reject(err);
          }).catch((err) => {
            reject(err);
          });
        });
      }
    })
  });
}

const confirm = async (user) => {

  var userData = {
    Username: user.email,
    Pool: userPool
  };

  var cognitoUser = new AWSCognito.CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(user.confirmCode, true, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  });
};

const login = async (user) => {

  var authenticationData = {
    Username: user.email,
    Password: user.password
  };

  var authenticationDetails = new AWSCognito.AuthenticationDetails(authenticationData);

  var userData = {
    Username: user.email,
    Pool: userPool
  };

  var cognitoUser = new AWSCognito.CognitoUser(userData);
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        console.log(cognitoUser)
        console.log('access token + ' + result.getIdToken().getJwtToken());
        resolve(result);
      },

      onFailure: function (err) {
        reject(err)

      }
    })
  });
};

const validate = (req, res, next) => {

  const token = req.cookies.jwt;
  console.log(token);
  request({
    url: `https://cognito-idp.us-west-2.amazonaws.com/${USERPOOL_ID}/.well-known/jwks.json`,
    json: true
  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      pems = {};
      var keys = body['keys'];
      for (var i = 0; i < keys.length; i++) {
        //Convert each key to PEM
        var key_id = keys[i].kid;
        var modulus = keys[i].n;
        var exponent = keys[i].e;
        var key_type = keys[i].kty;
        var jwk = { kty: key_type, n: modulus, e: exponent };
        var pem = jwkToPem(jwk);
        pems[key_id] = pem;
      }
      //validate the token
      var decodedJwt = jwt.decode(token, { complete: true });
      if (!decodedJwt) {
        console.log("Not a valid JWT token");
        res.status(401);
        res.send("Unauthorized access or bad token.");
        return false;
      }
      if (req.params.email != decodedJwt.payload.email) {
        console.log("JWT Token username and given username do not match");
        res.status(401);
        res.send("Unauthorized access or bad token.");
        return false;
      }

      var kid = decodedJwt.header.kid;
      var pem = pems[kid];
      if (!pem) {
        res.status(401);
        res.send("Unauthorized access or bad token.");
        return false;
      }

      jwt.verify(token, pem, function (err, payload) {
        if (err) {
          res.status(401);
          res.send("Unauthorized access or bad token.");
          return false;
        } else {
          console.log("Valid token");
          next();
          return true;
        }
      });
    } else {
      console.log("Error! Unable to download JWKs");
    }
  });

};

const remove = async (user) => {
  var authenticationData = {
    Username: user.email,
    Password: user.password
  };

  var authenticationDetails = new AWSCognito.AuthenticationDetails(authenticationData);

  var userData = {
    Username: user.email,
    Pool: userPool
  };

  var cognitoUser = new AWSCognito.CognitoUser(userData);
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        cognitoUser.deleteUser((err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log("Successfully deleted the user.");
            console.log(result);
            resolve(result);
          }
        });
      },
      onFailure: function (err) {
        reject(err);
        console.log(err);
      },
    })
  });
}

const changePassword = async (user) => {

  var authenticationDetails = new AWSCognito.AuthenticationDetails({
    Username: user.email,
    Password: user.password,
  });

  var userData = {
    Username: user.email,
    Pool: userPool
  };
  var cognitoUser = new AWSCognito.CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        cognitoUser.changePassword(user.password, user.newpassword, (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log("Successfully changed password of the user.");
            console.log(result);
            resolve(result);
          }
        });
      },
      onFailure: function (err) {
        console.log(err);
        reject(err);
      },
    })
  });
}

module.exports = { signup, confirm, login, validate, changePassword };