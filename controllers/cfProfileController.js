//Import Models
const commentModel = require('../models/comment');
const reviewModel = require('../models/review');

exports.load =  function(req, res){
	if (req.session.loggedin){
		if (req.session.admin){
			reviewModel.getAll({studentId: req.session.idNum}, function(reviews){
				commentModel.getAllProfile({studentRef: req.session.studentRef}, function(comments){
					res.render('frontend/profile',{
						layout: 'backend',
						session: req.session,
						reviews: reviews,
						comments: comments,
						title: 'Profile',
						session: req.session,
						jumbotronImage: '/assets/headers/user_header.jpg',
						jumbotronHeader: 'Hello ' + req.session.nickname + ',',
						jumbotronMessage: "This page shows your most recent contribution to the DLSU Community Forum. You may also change your password through the form below.",
						jumbotronBtn: 'Back to Homepage',
						jumbotronLink: '/'
					});
				});
			});
		} else{
			res.render('frontend/error',{
				session: req.session,
				error: '403',
	  			message: "Forbidden Access"
			});
		}
	} else{
		res.redirect('/login');
	}
};