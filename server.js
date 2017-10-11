var express = require('express');
var logger = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
app.use(session({ 
	secret: 'secretKey', 
	store: new (require('express-sessions'))({
        expire: 90000 // optional 
    })
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));

app.use(cookieParser());
app.use(session({secret: "Your secret key"}));
app.use(express.static(path.join(__dirname, 'dist')));
// connect with db
mongoose.connect('mongodb://localhost/chatdb',{useMongoClient: true}).then(()=>{console.log("connected with database")});

var onlineUsers = [];
var User = require('./models/user.js');
var Chat = require('./models/chat.js');
// get the connection from the client
io.on('connection',function(socket){
	const _id = socket.id;
	socket.on('new_connection',function(data){
		if(data !=null && data !==undefined){
			User.findOneAndUpdate({email:data.email},{socketId: _id},function(err,response){
				User.find({email:data.email},function(err,response){
					console.log(response[0]);
					onlineUsers.push(response[0]);
					io.sockets.emit('new_user',onlineUsers);
				})	
			})
		}
	});
	// get new message
	socket.on('new-message',function(data){
		console.log(data);
		var temp = new Chat({
			msgFromEmail :data.msgFromEmail, 
			msgFrom : data.msgFrom,
			msgTo : data.msgTo,
			msg : data.msg,
			room : data.room,
			createdOn: data.date
		})
		temp.save(function(err,response){
			if(err)
				console.log('error while saving chat: '+err)
			else{
				data = response;
			}
		})
		if(data.room === 'group'){
			socket.broadcast.emit('newChat',data);
		}
		else if(data.room === 'private'){
			User.find({email: data.msgTo},function(err,response){
				if(err)
					console.log(err);
				else{
					console.log(response[0].socketId);
					socket.to(response[0].socketId).emit('newChat',data);
				}	
			})
		}
	});
	// get chats from db
	socket.on('getChat',function(data){
		if(data === 'group'){
			Chat.find({room: data}).sort({createdOn: 'asc'}).exec(function(err,response){
				socket.emit('groupChat',response);
			})
		}
		else{
			Chat.find({
				$or:[
					{
						$and:[
							{msgFromEmail:data.user1},
							{msgTo:data.user2}
						]
					},
					{
						$and:[
							{msgFromEmail:data.user2},
							{msgTo:data.user1}
						]
					}
				]
			}).sort({createdOn: 'asc'}).exec(function(err,response){
				if(err)
					console.log(err);
				else{
					console.log(response);
					socket.emit('privateChat',response);
				}
			})
		}
	})
	socket.on('disconnect',()=>{
		console.log(socket.id);
		// console.log(onlineUsers);
		User.find({socketId: socket.id},function(err,response){
			if(err)
				console.log(err);
			else{
				if(response != undefined){
					console.log(response[0].email);
					var i = onlineUsers.filter(function(obj,index){
						console.log(index);
						console.log(obj.email);
						if(obj.email === response[0].email){
							onlineUsers.splice(index,1);
							io.sockets.emit('new_user',onlineUsers);
						}
					})
				}
			}
		})
	})
});
var routes = require('./routes/routes.js');

routes(app);
app.get('*',function(req,res){
	res.redirect('/');
})
server.listen(3000);