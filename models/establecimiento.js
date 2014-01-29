

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    DBRef = mongoose.SchemaTypes.DBRef,
    negocio = require('../models/negocio'),
    ciudad = require('../models/ciudad');

var TelefonoSchema = new Schema({
    tipo:    { type: String },
    numero:  { type: String }
});

var EstablecimientoSchema = new Schema({
    nombre:    { type: String },
    direccion: { type: String},
    telefonos: [TelefonoSchema],
    coordinates: {
        x:    { type: Number },
        y:    { type: Number }
    },
    ciudad: DBRef,
    negocio: DBRef,
    //comentarios: [DBRef],
    //fotos: [DBRef]
});

module.exports = mongoose.model('Establecimiento', EstablecimientoSchema);