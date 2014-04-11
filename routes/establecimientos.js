
module.exports = function(app, mongoose) {

    var Schema = mongoose.Schema;
    mongoose.set('debug', true);

    // the node file module
    var fs = require('fs');

    var User = require('../models/user.js'),
        NegocioCat = require('../models/ciudad'),
        Negocio = require('../models/negocio'),
        Foto = require('../models/foto'),
        Est = require('../models/establecimiento'),
        config = require('../config'),
        async = require('async'),

        formidable = require('formidable'),  // to handle the files uploaded
        util = require('util'),
        fs = require('fs-extra'); // middleware needed to move the files uploaded;

    // GET - return all Establecimientos
    findAllEst = function(req, res) {
        Est.find(function(err, ests){
            if(err) console.log('ERROR: ' + err);
            else {
                console.log('GET /establecimiento');

                res.setHeader('Content-Type','text/javascript');
                res.send( JSON.stringify(ests) );
            }
        });
    }//findAllEst()

    // GET - return a Establecimiento with specified ID
    findById = function(req, res) {
        //console.log(req.params);
        console.log(req.params.id);
        Est.findById(req.params.id).
            populate('ciudad').
            populate('negocio').
            populate('profilePicture').exec(function(err,est) {
                if(err) console.log('ERROR: ' +  err);
                else
                    res.send(est);
            });
    }//findById()

    // GET - return the nearest Establecimientos
    findNearest = function(req, res) {
        console.log(req.query.lon);
        console.log(req.query.lat);
        Est.geoNear([parseFloat(req.query.lat),parseFloat(req.query.lon)],
            { 
                near: [parseFloat(req.query.lat),parseFloat(req.query.lon)],
                spherical: true, 
                maxDistance: 0.4 / 6371,
                distanceMultiplier: 6371, 
                includeLocs: true, 
                uniqueDocs: true }, function(error, results, stats){
                    if(error) console.log('ERROR: ' + error);
                    else {
                        console.log(results);

                        res.setHeader('Content-Type','text/javascript');
                        res.send( JSON.stringify(results) );
                    }
        });
    }//findNearest()

    // GET - return the result of a query for Establecimientos
    search = function(req, res) {
        Est.where('nombre', new RegExp(req.query.q,'i'))
            .exec(function(err,ests) {
                if(err) console.log('ERROR: ' + err)
                else {
                    console.log('GET /establecimiento/query?q=' + req.query.q);

                    res.setHeader('Content-Type','text/javascript');
                    res.send( JSON.stringify(ests) );
                }   
            });
    }

    // POST - add a new picture to an Establecimiento
    uploadPic = function(req, res, next) {
        var _objs = {};
        var username = req.body.user,
            estId = req.body.est;

        async.series([
            function(callback) {
                User.findOne({ 'username': username})
                    .exec(function(err, user){
                        if(err) return callback(err);

                        if(!user) return callback(new Error("No user whit username " + username + " found."));

                        callback(null,user);
                    });
            },
            function(callback) {
                Est.findById(estId)
                    .exec(function(err,est) {
                        if(err) return callback(err);

                        if(!est) return callback(new Error("No Establecimiento with ID " + estId + " found"));

                        callback(null,est);
                    })
            },
            function(callback) {
                var form = new formidable.IncomingForm();

                form.parse(req,function(err,fields,files) {
                    if(err) return callback(err);
                    console.log(files);
                });

                form.on('end',function(fields,files) {
                    // temporary location of the uploaded file
                    var tempPath = this.openedFiles[0].path;
                    // filename of the uploaded file
                    var fileName = this.openedFiles[0].name;

                    var file = { tempPath: tempPath, fileName: fileName };

                    callback(null,file);
                })
            },
        ],function(err,results){
            if(err) return next(err);

            console.log(results);
            var user = results[0],
                est = results[1],
                file = results[2]
                newPath = config.uploadPicsDir + '/establecimientos/fullsize/';

            // a lot of thing here are wrong
            var picture = new Foto({ usuario: user.id, establecimiento: est.id });
            picture.save(function(err){
                if(err) console.log('ERROR: ' + err);
                else {
                    fs.copy(file.tempPath, config.uploadPicsDir + picture.id + '.jpg' , function(err) {
                        if(err) return next(err);

                        console.log("file success!");
                        
                        res.send('Ok');
                    });//end of copy()
                }
            });
        });// end async.series()
        
    }//uploadPic()


    // Link routes and functions
    app.get('/api/establecimientos',findAllEst);
    app.get('/api/establecimientos/near',findNearest);
    app.get('/api/establecimientos/search',search);
    app.post('/establecimientos/upload-pic',uploadPic)
    app.get('/api/establecimientos/:id',findById);
    
}// end of exportation of the routes