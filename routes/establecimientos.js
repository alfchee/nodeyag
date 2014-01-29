
module.exports = function(app) {

    var Est = require('../models/establecimiento');

    // GET - return all Establecimientos
    findAllEst = function(req, res) {
        Est.find(function(err, ests){
            if(err) console.log('ERROR: ' + err);
            else {
                console.log('GET /establecimiento');
                res.send(ests);
            }
        });
    }//findAllEst()

    // GET - return a Establecimiento with specified ID
    findById = function(req, res) {
        Est.findById(req.params.id, function(err,est) {
            if(err) console.log('ERROR: ' + err);
            else {
                console.log('GET /establecimiento/' + req.params.id);
                res.send(est);
            }
        });
    }//findById()

    // Link routes and functions
    app.get('/establecimiento',findAllEst);
    app.get('/establecimiento/:id',findById);
    
}// end of exportation of the routes