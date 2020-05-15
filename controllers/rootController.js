//Import Models
const collegeModel = require('../models/college');
const professorModel = require('../models/professor');
const reviewModel = require('../models/review');

exports.loadHome = function(req, res){
	if (req.session.loggedin){
	 	professorModel.getQuickView([{ $sample: { size: 3 } }], function(professors){
	 		reviewModel.getLimited(10, function(reviews){
	 			collegeModel.getAll({}, function(colleges){
	 				res.render('frontend/home',{
						session: req.session,
						colleges: colleges,
				    	data: professors,
				    	review: reviews,
						title: 'Home',
						jumbotronImage: '/assets/headers/home_header.jpg',
						jumbotronHeader: 'Welcome to CommForum',
						jumbotronMessage: 'This online platform aims to address all the concerns, judgment, and comments made by the students and alumni while maintaining a healthy and non-toxic environment in which the Lasallian Core Values are portrayed.',
						jumbotronLink: '/colleges',
						jumbotronBtn: 'View Colleges'
			    	});
	 			});
	 		});
	 	});
 	} else{
 		res.redirect('/login')
 	};
};