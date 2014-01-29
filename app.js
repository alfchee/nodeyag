
var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    mongoose = require('mongoose');

app.configure(function() {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

app.get('/',function(req,res) {
    res.send('Hello world');
});

// importing routes
est = require('./routes/establecimientos')(app);

// connection to mongodb
mongoose.connect('mongodb://localhost/yag',function(err,res) {
    if(err) {
        console.log('ERROR: conecting to database. ' + err);
    } else {
        console.log('Connected to database');
    }
});

// acces the mongoose-dbref module and install everything
var dbref = require('mongoose-dbref');
var utils = dbref.utils;

// install the types, plugins and monkey patches
var loaded = dbref.install(mongoose);

server.listen(3000,function() {
    console.log("Node server running on http://localhost:3000");
});
