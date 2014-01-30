
module.exports = function(app, mongoose, db) {

    mongoose.set('debug',true);

    var User = require('../models/user.js'),
        NegocioCat = require('../models/negocioCategoria'),
        Negocio = require('../models/negocio');

    findAll = function(req, res) {
        Negocio.find(function(err, negocios) {
            if(err) console.log('ERROR: ' + err);
            else {
                console.log('GET /negocio');
                res.send(negocios);
            }
        });
    }//findAll()

    findById = function(req, res) {
        Negocio.findById(req.params.id).
                populate('establecimientos').
                populate('categoria').
                populate('usuario').exec(function(err,negocio){
                    if(err) console.log('ERROR: ' + err);
                    else
                        res.send(negocio);
                });
    }//findById()

    // link between functions and routes
    app.get('/negocios',findAll);
    app.get('/negocios/:id',findById);
}