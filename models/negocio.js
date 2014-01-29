

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    DBRef = mongoose.SchemaTypes.DBRef;
    //est = require('../models/establecimiento');


var NegocioSchema = new Schema({
    nombre:    { type: String },
    dirOficinaCentral:   { type: String },
    //establecimientos: [EstablecimientoSchema]
});

module.exports = mongoose.model('Negocio', NegocioSchema);