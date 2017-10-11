module.exports = function(app){
	var controller = require('../controller/controller.js');
	//Routes 
	app.route('/signup').post(controller.signup);
	app.route('/login')
		.get(controller.isAuthenticated)
		.post(controller.login);
	app.route('/logout').get(controller.logout);
}