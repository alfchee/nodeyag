

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
    ciudad: { type: Schema.Types.ObjectId, ref: 'Ciudad' },
    negocio: { type: Schema.Types.ObjectId, ref: 'Negocio'}
    //comentarios: [DBRef],
    //fotos: [DBRef]
});

module.exports = mongoose.model('Establecimiento', EstablecimientoSchema,'Establecimiento');