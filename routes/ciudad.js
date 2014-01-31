


module.exports = function(app, mongoose) {

    mongoose.set('debug',true);

    var City = require('../models/ciudad.js');

    findAll = function(req, res) {
        City.find(function(err, cities) {
            if(err) console.log('ERROR: ' + err);
            else {
                console.log('GET /cities');
                res.send(cities);
            }
        });
    }//findAll()

    findById = function(req, res) {
        City.findById(req.params.id).
            exec(function(err,city){
                if(err) console.log('ERROR: ' + err);
                else
                    res.send(city);
            });
    }//findById()

    // link between functions and routes
    app.get('/cities',findAll);
    app.get('/cities/:id',findById);
}