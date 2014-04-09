

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FotoSchema = new Schema({
    titulo: { type: String },
    pieFoto: { type: String },
    inCarousel: { type: Boolean },
    usuario: { type: Schema.Types.ObjectId, ref: 'User' },
    establecimiento: { type: Schema.Types.ObjectId, ref: 'Establecimiento'},
    path: { type: String }
});


module.exports = mongoose.model('Foto',FotoSchema,'Foto');