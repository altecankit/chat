var mongoose = require('mongoose');
var User = require('../models/user.js');

exports.signup = function(req,res){
	var temp = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		socketId: null
	})
	User.find({email: temp.email},function(err,response){
		if(err)
			console.log('error while finding: ' + err)
		else if(response.length > 0){
			res.json({status: 'false', content:'user already exist'});
		}
		else{
			temp.save(function(err,User){
				if(err)
					console.log('error while signup: '+ err);
				else{
					console.log('user saved');
					console.log(User);
					res.json({status: 'ok', content: User});
				}
			})		
		}
	})
}
exports.login = function(req,res){
	User.find({email:req.body.email},function(err,response){
		if(err)
			console.log('error while finding: '+err)
		else if(response.length>0){
			console.log(response);
			if(req.body.password === response[0].password){
				req.session.user = response[0];
				res.json({status: 'true', content: response[0]});
			}
			else
				res.json({status: 'false', content:'password is incorrect'});
		}
		else{
			console.log('in else');
			res.json({status: 'false', content: 'no such user exist!\nplease signup first'})
		}
	})	
}
exports.isAuthenticated = function(req,res){
	if(req.session.user !== undefined){
		User.find({email:req.body.email},function(err,response){
			if(err)
				console.log('error while finding: '+err)
			else{
				console.log(response);
				res.json({status: 'authenticated', content: response[0]});
			}
		})
	}
}
exports.logout = function(req,res){
	req.session.destroy(function(){
		res.json({status: 'true', content:'you are successfully logged out'});
	})
}

