exports.checker = function(req,res) {
	req.session.destroy();
	res.render('login',{
		title: 'Log In',
		layout: 'authenticate'
	});
	console.log('You have succesfully logged out.');
}