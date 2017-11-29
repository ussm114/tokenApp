var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken'); // to create, sign, and verify token
var config = require('../config');
var User = require('../app/models/user');
var router = express.Router();


app.set('secretVariable', config.secret); //secret

router.post('/authenticate', function(req, res) {
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;
    if(!user) {
      res.json({success: false, message: 'Auth failed. user not found'});
    }
    else if(user) {
      //check for password match
      if(user.password != req.body.password) {
        res.json({ success: false, message: 'Auth failed. wrong password'});
      }
      else {
        //if user found and password is right
        //create token with only our given payload
        // we dont pass in the entire user since that has the password
        const payload = {
          admin: user.admin
        };
        var token = jwt.sign(payload, app.get('secretVariable'), {
          expiresIn: "1d",  //expires in 24 h
          issuer: user.name
        });
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  });
});

//route middleware to verify token
router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token`
  var token = req.body.token || req.query.token || req.headers['x-access-token']; //
  //decode token
  if(token) {
    //verify secret and checks exp
    jwt.verify(token, app.get('secretVariable'), function(err, decoded) {
      if(err) {
        return res.json({success: false, message: 'Failed to auth token'});
      }
      else {
        req.decoded = decoded;
        console.log(decoded);
        var d1 = new Date(decoded.iat).toUTCString();
        var d2 = new Date(decoded.exp).toUTCString();
        console.log('issued: ' + d1);
        console.log('expires: ' + d2);
        // console.log('admin?: ' + req.decoded.admin);
        // console.log('decoded: ');
        // console.log(decoded);
        next();
      }
    });
  }
  else {
    // if there is no token return error
    return res.status(403).send({
      success: false,
      message: 'no token provided'
    });
  }
});


// route to show a message ( GET)
// apiRoutes.get('/', function(req, res) {
//   res.json({message:"weclome to the coolest api on earth"});
// });

//route to return all users GET api/users
router.get('/users', function(req, res) {
  User.getUsers(function(err, users) {
  if(err) {
    throw err;
  }
  res.json(users);
  });
});

router.get('/', function(req, res) {
  res.json({message:"weclome to the coolest api on earth"});
});

module.exports = router;
//
