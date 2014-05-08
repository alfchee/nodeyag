
module.exports = function(app, mongoose) {

    var Schema = mongoose.Schema;
    mongoose.set('debug', true);

    var User = require('../models/user.js'),
        NegocioCat = require('../models/ciudad'),
        Negocio = require('../models/negocio'),
        Foto = require('../models/foto'),
        Comentario = require('../models/comentario'),
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

    // POST - add Comments to an Establecimiento
    addComment = function(req,res) {
        console.log(req);

        var username = req.query.user,
            estId = req.query.est,
            title = req.body.title,
            ranking = req.body.rating,
            comment = req.body.comment;

        
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
        ],function(err,results){
            if(err) console.log(err);

            console.log(results);
            var user = results[0],
                est = results[1];

            /// TODO: save the comment
            var comentario = new Comentario({
                usuario: user.id,
                establecimiento: est.id,
                titulo: title,
                ranking: ranking,
                comentario: comment
            });
            comentario.save(function(err) {
                if(err) console.log(err);

                res.send('comment saved');
            });
        });// end async.series()
    }//addComment()

    // GET - return the Comments related to an Establecimiento Document
    getComments = function(req, res) {
        var estId = req.query.est;

        Comentario.find({ establecimiento: estId})
                    .sort('-fecha')
                    .exec(function(err,comments) {
                        if (err) console.log('ERROR: ' + err);
                        else {
                            res.setHeader('Content-Type','text/javascript');
                            res.send( JSON.stringify(comments) );                            
                        }
                    });
    }//getComments()

    // GET - return the Foto's related to a Establecimiento Document
    getPictures = function(req,res) {
        var estId = req.query.est;

        Foto.find({ establecimiento: estId })
            .exec(function(err,pics) {
                if(err) console.log('ERROR: ' + err);
                else {
                    res.setHeader('Content-Type','text/javascript');
                    res.send(JSON.stringify(pics));
                }
            });
    }//getPictures

    // POST - add a new picture to an Establecimiento
    uploadPic = function(req, res, next) {
        async.waterfall(([
            function(callback) {
                var form = new formidable.IncomingForm(); // parsing the request

                form.parse(req,function(err,fields,files) {
                    if(err) return callback(err);

                    // obtaining the information from user related to the picture
                    var username = fields.user,
                        estId = fields.est
                        title = fields.title,
                        pie = fields.pie;

                    //console.log(fields);
                    // temporary location of the uploaded file
                    var tempPath = files.file.path;
                    // filename of the uploaded file
                    var fileName = files.file.name;

                    file = { tempPath: tempPath, fileName: fileName };
                    //console.log('file: ' + JSON.stringify(file));
                    callback(null,{ username: username, estId: estId, file: file, title: title, pie: pie });
                });
            },
            function(Pic, callback) {
                // searching the user
                User.findOne({ 'username': Pic.username})
                    .exec(function(err, user){
                        if(err) return callback(err);

                        if(!user) return callback(new Error("No user whit username '" + Pic.username + "'' found."));

                        callback(null,Pic,user);
                    });
            },
            function(Pic,user,callback) {
                //searching the Establecimiento
                Est.findById(Pic.estId)
                    .exec(function(err,est) {
                        if(err) return callback(err);

                        if(!est) return callback(new Error("No Establecimiento with ID " + Pic.estId + " found"));

                        callback(null,{ picture: Pic, user: user, est: est});
                    });
            }
        ]), function(err, result) {
            //var newPath = '/Applications/XAMPP/htdocs/yag/web/bundles/upload' + '/establecimientos/fullsize/';

            // setting the information of the Foto Document
            var picture = new Foto({ 
                                usuario: result.user.id, 
                                establecimiento: result.est.id,
                                titulo: result.picture.title,
                                pieFoto: result.picture.pie,
                                inCarousel: false 
                            });

            // saving the Foto Docuent
            picture.save(function(err){
                if(err) console.log('ERROR: ' + err);
                else {
                    fs.copy(result.picture.file.tempPath, config.uploadPicsDir + picture.id + '.jpg' , function(err) {
                    //fs.copy(result.picture.file.tempPath, newPath + picture.id + '.jpg' , function(err) {
                        if(err) return next(err);

                        // adding the path attribute, used to seek it in web
                        picture.path = picture.id + '.jpg';
                        picture.save(); // saving again

                        //console.log("file success!");
                        res.send('Ok');
                    });//end of copy()
                }
            });
        });
    }//uploadPic()


    // Link routes and functions
    app.get('/api/establecimientos',findAllEst);
    app.get('/api/establecimientos/near',findNearest);
    app.get('/api/establecimientos/search',search);
    app.post('/establecimientos/comment',addComment);
    app.get('/establecimientos/comments',getComments);
    app.post('/establecimientos/upload-pic',uploadPic);
    app.get('/api/establecimientos/:id',findById);
    
}// end of exportation of the routes