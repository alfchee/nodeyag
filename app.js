
var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    mongoose = require('mongoose');

app.configure(function() {
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

// connection to mongodb
var db = mongoose.connect('mongodb://localhost/yag',function(err,res) {
    if(err) {
        console.log('ERROR: conecting to database. ' + err);
    } else {
        console.log('Connected to database');
    }
});



app.get('/',function(req,res) {
    res.send('Hello world');
});

// importing routes
est = require('./routes/establecimientos')(app,mongoose);
neg = require('./routes/negocios')(app,mongoose,db);
cit = require('./routes/ciudad')(app,mongoose);

server.listen(3000,function() {
    console.log("Node server running on http://localhost:3000");
});
