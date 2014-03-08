
module.exports = function(app, mongoose) {

    var Schema = mongoose.Schema;
    mongoose.set('debug', true);

    var User = require('../models/user.js'),
        NegocioCat = require('../models/ciudad'),
        Negocio = require('../models/negocio'),
        Est = require('../models/establecimiento');

    // GET - return all Establecimientos
    findAllEst = function(req, res) {
        Est.find(function(err, ests){
            if(err) console.log('ERROR: ' + err);
            else {
                console.log('GET /establecimiento');
                var jsonpCallback = req.query.callback;

                res.setHeader('Content-Type','text/javascript');
                res.send(jsonpCallback + "(" + JSON.stringify(ests) + ");");
            }
        });
    }//findAllEst()

    // GET - return a Establecimiento with specified ID
    findById = function(req, res) {
        Est.findById(req.params.id).
            populate('ciudad').
            populate('negocio').exec(function(err,est) {
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
                        var jsonpCallback = req.query.callback;

                        res.setHeader('Content-Type','text/javascript');
                        res.send(jsonpCallback + '(' + JSON.stringify(results) + ');');
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
                    var jsonpCallback = req.query.callback;

                    res.setHeader('Content-Type','text/javascript');
                    res.send(jsonpCallback + "(" + JSON.stringify(ests) + ");");
                }   
            });
    }

    // Link routes and functions
    app.get('/establecimientos',findAllEst);
    app.get('/establecimientos/near',findNearest);
    app.get('/establecimientos/search',search);
    app.get('/establecimientos/:id',findById);
    
}// end of exportation of the routes