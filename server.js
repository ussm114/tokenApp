var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken'); // to create, sign, and verify token
var config = require('./config');
var User = require('./app/models/user');

// configuration
var port = process.env.PORT || 8000;
mongoose.connect(config.database,  { useMongoClient: true });
let db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

app.set('secretVariable', config.secret); //secret

// use bodyParser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());

// use morgan to log request to console
app.use(morgan('dev'));

//routes

//home route
app.get('/', function(req, res) {
  res.send('hello! the api is at http://localhost:' + port + '/api');
});


//apply the routes to our application with the prefix apiRoutes
//app.use('/api', apiRoutes);

let apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);
//start server
app.listen(port);
console.log('running on http://localhost:' + port);


























//
