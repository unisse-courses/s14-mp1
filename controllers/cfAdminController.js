//Import Models
const collegeModel = require('../models/college');
const professorModel = require('../models/professor');
const userModel = require('../models/user');
const commentModel = require('../models/comment');
const reviewModel = require('../models/review');

exports.load =  function(req,res) {
	if (req.session.loggedin) {
		if (req.session.admin) {
			collegeModel.count({}, function(collegeCount){
				reviewModel.count({}, function(reviewCount){
					professorModel.count({}, function(professorCount){
						userModel.count({}, function(userCount){
							res.render('backend/admin',{
								session: req.session,
								title: 'Dashboard',
								layout: 'backend',
								collegeCount: collegeCount,
								reviewCount: reviewCount,
								professorCount: professorCount,
								userCount: userCount,
								jumbotronImage: '/assets/headers/admin_header.jpg',
								jumbotronHeader: 'Welcome, Admin!',
								jumbotronMessage: 'Thank you for taking part in maintaining peace and order within our online platform. This is the backend of the website which has the ultimate power to moderate the contents and features of our Community Forum.',
								jumbotronLink: '/',
								jumbotronBtn: 'View Frontend'
							});
						});
					});
				});
			});
		} else {
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

exports.getAllColCount = async function(req,res) {
	if (req.session.loggedin) {
		if (req.session.admin) {
			const collegeRes = await collegeModel.getAllLean({});
			const resultPromises = collegeRes.map(async college => {
		    	const professorCount = await professorModel.countAll({college: college.shortName});
		    	college.count = professorCount;
		    	return college;
		  	});
		  	const collegeObject = await Promise.all(resultPromises);

			res.render('backend/colleges',{
				session: req.session,
				data: collegeObject,
				title: 'College Panel',
				layout: 'backend',
				jumbotronImage: '/assets/headers/admin_header.jpg',
				jumbotronHeader: 'College Panel',
				jumbotronMessage: 'Welcome to the college panel. This page has the ultimate power to add, edit, and delete any college page found inside the Community Forum.',
				jumbotronLink: '/cf-admin',
				jumbotronBtn: 'Back to Dashboard'
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

exports.getAllRevCom = async function(req,res) {
	if (req.session.loggedin) {
		if (req.session.admin) {
			const reviewRes = await reviewModel.getAllLean({});
			const resultPromises = reviewRes.map(async review => {
		    	const commentCount = await commentModel.countAll({reviewRef: review._id});
		    	review.count = commentCount;
		    	return review;
		  	});
		  	const reviewObject = await Promise.all(resultPromises);
		  	commentModel.getAll({}, function(comments){
		  		res.render('backend/reviews',{
					session: req.session,
					review: reviewObject,
					comment: comments,
					title: 'Review Panel',
					layout: 'backend',
					jumbotronImage: '/assets/headers/admin_header.jpg',
					jumbotronHeader: 'Review Panel',
					jumbotronMessage: 'Welcome to the Review’s Panel. This page has the capacity to edit any review and also delete certain reviews located in the DLSU Community Forum.',
					jumbotronLink: '/cf-admin',
					jumbotronBtn: 'Back to Dashboard'
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

exports.getAllProfCount = async function(req,res) {
	if (req.session.loggedin) {
		if (req.session.admin) {
			const professorRes = await professorModel.getAllLean({});
			const resultPromises = professorRes.map(async professor => {
		    	const reviewCount = await reviewModel.countAll({profRef: professor._id});
		    	professor.count = reviewCount;
		    	return professor;
		  	});
		  	const professorObject = await Promise.all(resultPromises);
		  	collegeModel.getAll({}, function(colleges){
				res.render('backend/professors',{
					colleges: colleges,
					session: req.session,
					professor: professorObject,
					title: 'Professor Panel',
					layout: 'backend',
					jumbotronImage: '/assets/headers/admin_header.jpg',
					jumbotronHeader: 'Professor Panel',
					jumbotronMessage: 'Welcome to the Professor Panel. This page is not only for adding and deleting a professor but it also has the capability to edit the professor’s information and the course that they are currently teaching.',
					jumbotronLink: '/cf-admin',
					jumbotronBtn: 'Back to Dashboard'
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

exports.getAllUserCount = async function(req,res) {
	if (req.session.loggedin){
		if (req.session.admin){
			const userRes = await userModel.getAllLean({});
			const resultPromises = userRes.map(async user => {
		    	const reviewCount = await reviewModel.countAll({studentId: user.studentId});
		    	user.count = reviewCount;
		    	return user;
		  	});
		  	const userObject = await Promise.all(resultPromises);

			res.render('backend/users',{
				session: req.session,
				user: userObject,
				title: 'User Panel',
				layout: 'backend',
				jumbotronImage: '/assets/headers/admin_header.jpg',
				jumbotronHeader: 'User Panel',
				jumbotronMessage: 'Welcome to the User Panel. This page has the ability to add, ban and delete a user participating inside the community forum while also having the freedom to update the user information.',
				jumbotronLink: '/cf-admin',
				jumbotronBtn: 'Back to Dashboard'
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

