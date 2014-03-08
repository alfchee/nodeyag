
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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

CiudadSchema.index({ 'coordinates': "2dsphere" });

module.exports = mongoose.model('Ciudad', CiudadSchema,'Ciudad');