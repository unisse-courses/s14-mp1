exports.checker = function(req,res) {
	if (req.session.loggedin) {
		res.render('frontend/error',{
			session: req.session,
			error: '403',
	  		message: "The Page is forbidden"
		});
	}
	else {
		res.render('login',{
			title: 'Log In',
			layout: 'authenticate'
		});
	}
};