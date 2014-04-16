

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ComentarioSchema = new Schema({
    titulo: { type: String },
    fecha: { type: Date, default: Date.now },
    ranking: { type: Number },
    comentario: { type: String },
    establecimiento: { type: Schema.Types.ObjectId, ref: 'Establecimiento' },
    usuario: { type: Schema.Types.ObjectId, ref: 'User' }
}); 

module.exports = mongoose.model('Comentario',ComentarioSchema,'Comentario');