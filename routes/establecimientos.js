
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
        config = require('../config');

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
    uploadPic = function(req, res) {
        var _objs = {};

        function retrieveUser(username, callback) {
            User.findOne({ 'username': username })
                .exec(function(err, user){
                    if(err) callback(err,null);
                    else callback(null,user);
                });
        }//retrieveUser()

        function retrieveEst(id, callback) {
            Est.findById(id)
                .exec(function(err, estb) {
                    if(err) callback(err,null);
                    else callback(null, estb);
                });
        }//retrieveEst()

        retrieveUser(req.body.user,function(err,user) {
            if(err) console.log('ERROR: ' + err);
            else _objs.user = user;
        });

        retrieveEst(req.body.est, function(err, est) {
            if(err) console.log('ERROR: ' + err);
            else _objs.est = est;
        });

        if(!_objs.user || !_objs.est) {
            console.log("Empty both");
            return;
        }

        var picture = new Foto({ usuario: _objs.user, establecimiento: _objs.est });
        picture.save(function(err){
            if(err) console.log('ERROR: ' + err);
            else {
                fs.readFile(req.files.file.path, function(err,data) {
                    var imageName = picture._id;

                    // if there's an error
                    if(!imageName) {
                        console.log("There was an error");
                    } else {
                        var newPath = config.uploadPicsDir + '/establecimientos/fullsize/' + imageName;

                        //write the image in the right folder
                        fs.writeFile(newPath, data, function(err) {
                            if(err) console.log('ERROR: ' + err);
                            else res.send('Ok');
                        });
                    }
                });//end of readFile()
            }
        });
    }//uploadPic()


    // Link routes and functions
    app.get('/api/establecimientos',findAllEst);
    app.get('/api/establecimientos/near',findNearest);
    app.get('/api/establecimientos/search',search);
    app.post('/establecimientos/upload-pic',uploadPic)
    app.get('/api/establecimientos/:id',findById);
    
}// end of exportation of the routes