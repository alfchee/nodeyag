

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var NegocioSchema = new Schema({
    nombre:    { type: String },
    dirOficinaCentral:   { type: String },
    categoria:  { type: Schema.Types.ObjectId, ref: 'NegocioCategoria' },
    establecimientos: [{ type: Schema.Types.ObjectId, ref: 'Establecimiento' }],
    usuario: { type: Schema.Types.ObjectId, ref: 'User' }
});


module.exports = mongoose.model('Negocio', NegocioSchema,'Negocio');