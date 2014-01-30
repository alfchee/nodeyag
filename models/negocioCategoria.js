


var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var NegocioCatSchema = new Schema({
    nombre:    { type: String },
});

module.exports = mongoose.model('NegocioCategoria', NegocioCatSchema,'NegocioCategoria');