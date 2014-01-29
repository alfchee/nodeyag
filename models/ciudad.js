
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    DBRef = mongoose.SchemaTypes.DBRef;

var EmergenciaSchema = new Schema({
    tipo:    { type: String },
    telefono:    { type: String }
});

var CiudadSchema = new Schema({
    nombre:    { type: String },
    coordinates:   { 
        x:    { type: Number },
        y:    { type: Number}
    },
    emergenciaServicios: [EmergenciaSchema],
});

module.exports = mongoose.model('Ciudad', CiudadSchema);