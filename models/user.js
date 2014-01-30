


var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var UserSchema = new Schema({
    username:  { type: String },
    usernameCanonical: { type: String },
    name:    { type: String },
    email:      { type: String },
    emailCanonical: { type: String },
    password:  { type: String },
    salt:      { type: String },
    roles:     [ String ],
    enabled:   { type: Boolean },
    expired:   { type: Boolean },
    locked:    { type: Boolean },
    confirmationToken: { type: String }
});


module.exports = mongoose.model('User', UserSchema,'User');