var mongoose = require('mongoose');
var chatSchema = mongoose.Schema({
	msgFromEmail :{type:String,default:"",required:true}, 
	msgFrom : {type:String,default:"",required:true},
	msgTo : {type:String,default:"",required:true},
	msg : {type:String,default:"",required:true},
	room : {type:String,default:"",required:true},
	createdOn : {type:Date,default:Date.now}
});

module.exports = mongoose.model('Chat',chatSchema);
