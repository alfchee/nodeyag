

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var DBRef = mongoose.SchemaTypes.DBRef;

var TelefonoSchema = new Schema({
    tipo:    { type: String },
    numero:  { type: String }
});

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

/*var NegocioSchema = new Schema({
    nombre:    { type: String },
    dirOficinaCentral:   { type: String },
    establecimientos: [EstablecimientoSchema]
});*/

var EstablecimientoSchema = new Schema({
    nombre:    { type: String },
    direccion: { type: String},
    telefonos: [TelefonoSchema],
    coordinates: {
        x:    { type: Number },
        y:    { type: Number }
    },
    //ciudad: DBRef,
    //negocio: DBRef,
    //comentarios: [DBRef],
    //fotos: [DBRef]
});

module.exports = mongoose.model('Ciudad', CiudadSchema);