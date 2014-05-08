// server.js

// BASE SETUP
// ==============================================

var express = require('express'),
	bodyParser = require('body-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),

    config = require('./config'),
    bcrypt = require('bcrypt'), // bcrypt is a library for encripton
    jwt = require('jsonwebtoken'),
    expressJwt = require('express-jwt'),  // middleware to handle the JWT Token
    mongoose = require('mongoose');

var app     = express();
var port    = 	process.env.PORT || 3001;


// Configuring Cross Domain
// ==============================================
var enableCors = function(req,res,next) {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers','Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
};

// ENABLING MIDDLEWARES
// ==============================================
app.use(enableCors);
app.use(morgan());
app.use(bodyParser());
app.use(methodOverride());
app.use('/api',expressJwt({ secret: config.sessionSecret }));

// CONNECTION TO DB
// ==============================================
var db = mongoose.connect('mongodb://localhost/yag',function(err,res) {
    if(err) {
        console.log('ERROR: conecting to database. ' + err);
    } else {
        console.log('Connected to database');
    }
});

var Schema = mongoose.Schema;
    mongoose.set('debug', true),
    User = require('./models/user.js');


// ROUTES
// ==============================================

// sample route with a route the way we're used to seeing it
app.get('/sample', function(req, res) {
	res.send('this is a sample!');	
});

// GET - /api/auth
// @desc:   check a user's auth status based on cookie
app.get('/api/auth',function(req,res) {
    User.findById(req.params.id).exec(function(err,user) {
        if(err) res.json({ error: 'Client has no valid login cookies.'});
        else {
            res.json({ user: user });
        }
    });
});

// POST - /authenticate
// @desc:   logs in a user
app.post('/authenticate',function(req,res) {
    console.log(req.body);
    User.findOne({ username: req.body.username }).exec(function(err,user) {
        if(err) res.json({ error: err });
        if(!user) { res.send(401); } 
        else {
            var token = jwt.sign(user,config.sessionSecret, {
                expiresInMinutes: 60 * 5
            });

            res.json({ token: token });
        }
    });
});

// POST - /refresh-token
app.post('/refresh-token',function(req,res) {
    if(!req.body.token) res.send(401);
    // verify the existing token
    jwt.verify(req.body.token, config.sessionSecret, function(err, decoded) {
        if(err) res.send('ERROR: ' + err);
        // check if the user still exists
        User.findOne({ username: decoded.username }).exec(function(err,user) {
            if(err) res.json({ error: err });
            if(!user) res.send(401);
            else {
                var token = jwt.sign(user,config.sessionSecret, {
                    expiresInMinutes: 60 * 5
                });
                res.json({ token: token });
            }
        });
    });
});

// importing routes
est = require('./routes/establecimientos')(app,mongoose);
neg = require('./routes/negocios')(app,mongoose,db);
cit = require('./routes/ciudad')(app,mongoose);

// we'll create our routes here

// START THE SERVER
// ==============================================
app.listen(port);
console.log('Magic happens on port ' + port);