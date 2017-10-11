var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
	name:String,
	email:String,
	password: String,
	socketId: String
});
module.exports = mongoose.model('users',userSchema);