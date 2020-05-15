//Import Models
const collegeModel = require('../models/college');
const commentModel = require('../models/comment');
const reviewModel = require('../models/review');

exports.getAllRevCount = async function(req,res){
	if (req.session.loggedin){
		const reviewRes = await reviewModel.getAllLean({});
		const resultPromises = reviewRes.map(async review => {
    		const commentCount = await commentModel.countAll({reviewRef: review._id});
			review.count = commentCount;
			return review;
  		});
		const reviewObject = await Promise.all(resultPromises);

		collegeModel.getAll({}, function(colleges){
			res.render('frontend/reviews', {
				session: req.session,
				review: reviewObject,
				colleges: colleges,
				title: 'Reviews',
				jumbotronImage: '/assets/headers/profpage_header.jpg',
				jumbotronHeader: 'Reviews',
				jumbotronMessage: 'The review page displays all the reviews made by the students and alumni regarding relevant experiences and interactions with the university professors.',
				jumbotronLink: '/',
				jumbotronBtn: 'Back to Homepage'
			});
		});
	} else{
		res.redirect('/login');
	}
};

exports.getReview = function(req,res){
	if (req.session.loggedin){
		const link = req.params.id;

		reviewModel.getRev({_id: link}, function(review){
			if(review === null){
				res.render('frontend/error',{
					session: req.session,
					error: '404',
	  				message: "The Page can't be found"
				});
			}
			else{
				collegeModel.getCollege({shortName: review.profRef.college}, function(college){
					commentModel.getAll({reviewRef: review._id}, function(comments){
						res.render('frontend/revpage', {
							session: req.session,
							comment: comments,
							college: college.toObject(),
							review: review.toObject(),
							title: "Review on " + review.profRef.profName,
							jumbotronImage: '/assets/headers/profpage_header.jpg',
							jumbotronHeader: review.profRef.profName,
							jumbotronMessage: 'An exemplary Lasallian educator who teach minds, touch hearts, and transform lives by diligently teaching ' + review.profRef.profCourse + ' from the ' + college.longName + '.',
							jumbotronLink: '/',
							jumbotronBtn: 'Back to Homepage'
						});
					});
				});
			}
		});
	} else{
		res.redirect('/login');
	}
};