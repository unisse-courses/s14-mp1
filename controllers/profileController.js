//Import Models
const commentModel = require('../models/comment');
const reviewModel = require('../models/review');

exports.loadProfile = function(req, res){
	if (req.session.loggedin){
		reviewModel.getAll({studentId: req.session.idNum}, function(reviews){
			commentModel.getAll({studentRef: req.session.studentRef}, function(comments){
				res.render('frontend/profile',{
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
		res.redirect('/login');
	}
};