//Package Dependencies
var mongodb = require('mongodb');
var express = require('express');
var sassMiddleware = require('node-sass-middleware');
var path = require('path');
var hbs = require('express-handlebars');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Import Models
const collegeModel = require('./models/college');
const professorModel = require('./models/professor');
const userModel = require('./models/user');
const reviewModel = require('./models/review');

//Environments Configuration
app.set('view engine', 'hbs');
app.set('port', (process.env.PORT || 3000));
app.engine('hbs',hbs({
	extname: 'hbs',
	defaultView: 'main',
	layoutsDir: __dirname + '/views/layouts/',
	partialsDir: __dirname + '/views/partials/',
	helpers: {
        ifCond: function(v1, v2, options) {
		  if(v1 === v2) {
		    return options.fn(this);
		  }
		  return options.inverse(this);
		}
    }
}));
app.use(sassMiddleware({
    src: __dirname + '/public/scss',
    dest: __dirname + '/public/css',
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/css'
}));
app.use(express.static(path.join(__dirname, 'public')));

// Configuration for handling API endpoint data
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Route Definition
app.get('/', function(req, res){
 	professorModel.aggregate([{ $sample: { size: 3 } }]).then(function(qvProfs) {
 		reviewModel.find({}).populate('profRef').populate('studentRef').sort({_id:-1}).limit(10).exec(function(err,mostRecent) {
 			collegeModel.find({}).exec(function(err, col){
				var colleges = [];
				var reviews = [];

				col.forEach(function(document){
					colleges.push(document.toObject());
				});

	 			mostRecent.forEach(function(document){
					reviews.push(document.toObject());
				});

				res.render('frontend/home',{
					colleges: colleges,
			    	data: qvProfs,
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
});

app.get('/colleges', function(req, res){
	collegeModel.find({}).exec(function(err, result){
		var collegeObjects = [];

		result.forEach(function(document){
			collegeObjects.push(document.toObject());
		});

	  	res.render('frontend/colleges',{
	  		data: collegeObjects,
			title: 'Colleges',
			jumbotronImage: '/assets/headers/college_header.jpg',
			jumbotronHeader: 'Colleges',
			jumbotronMessage: 'De La Salle University has 7 Colleges with different specializations in which aims to hone the skills of diverse individuals in their track. These Colleges are each catered to developing the interior and exterior knowledge needed by an individual to be a fully-pledged Lasallian leader.',
			jumbotronLink: '/professors',
			jumbotronBtn: 'View Professors'
		});
	});
});

app.get('/colleges/:college', function(req, res){
	const link = req.params.college.toUpperCase();

	collegeModel.findOne({shortName: link}, function(err, college) {
		if(college === null){
			res.render('frontend/error',{
				title: '404',
  				status: '404'
			});
		}
		else{
			res.render('frontend/colpage',{
				college: college.toObject(),
				jumbotronImage: '/assets/headers/colpage_header.jpg',
				jumbotronHeader: college.longName,
				jumbotronMessage: 'The ' + college.longName +' offers different degree programs in which aim to hone the skills of each individual and help them articulate the knowledge being dealt with them while striving to apply the Lasallian Core Values, which will resemble the breeding ground for the future Lasallian leaders.',
				jumbotronLink: '/colleges/' + college.shortName + '/professors',
				jumbotronBtn: 'View ' + college.shortName + ' Professors',
				title: link
			});
		}
	});
});

app.get('/colleges/:college/professors', function(req, res){
	const link = req.params.college.toUpperCase();

	professorModel.find({college: link}).exec(function(err, result){
		var professorObject = [];

		result.forEach(function(document){
			professorObject.push(document.toObject());
		});

		if(professorObject.length === 0){
			res.render('frontend/error',{
				title: '404',
  				status: '404'
			});
		}
		else{
			res.render('frontend/professors',{
				professor: professorObject,
				title: link + ' Professors',
		      	jumbotronImage: '/assets/headers/colpage_header.jpg',
				jumbotronHeader: link + ' Professors',
				jumbotronMessage: 'The College of Liberal Arts has professors that promise to share all their knowledge and tools to effectively aid students in being graduates of their desired programs while embodying the Lasallian Core Values.',
				jumbotronLink: '/',
				jumbotronBtn: 'Back to Homepage',
			});
		}
	});
});

app.get('/professors', function(req, res){
	professorModel.find({}, null, {sort: {profName: 1}}).exec(function(err, result){
		var professorObject = [];

		result.forEach(function(document){
			professorObject.push(document.toObject());
		});

		if(professorObject.length === 0){
			res.render('frontend/error',{
				title: '404',
  				status: '404'
			});
		}
		else{
			res.render('frontend/professors',{
				professor: professorObject,
				title: 'Professors',
		      	jumbotronImage: '/assets/headers/colpage_header.jpg',
				jumbotronHeader: 'Professors',
				jumbotronMessage: 'The Professors of De La Salle University aims to provide all the students with the necessary learning tools in obtaining knowledge to maximize all the skills and talents one must possess before being deployed to their chosen careers.',
				jumbotronLink: '/',
				jumbotronBtn: 'Back to Homepage',
			});
		}
	});
});

app.get('/professors/:id', function(req, res){
	const link = req.params.id;

	professorModel.findOne({profNumber: link}, function(err, professor) {
		if(professor === null){
			res.render('frontend/error',{
				title: '404',
	  			status: '404'
			});
		}
		else{
			var profData = professor.toObject();
			reviewModel.find({profRef: profData._id}).populate('profRef').populate('studentRef').sort({_id:-1}).exec(function(err,result) {
	 			var reviews = [];

	 			result.forEach(function(document){
					reviews.push(document.toObject());
				});

				collegeModel.findOne({shortName: profData.college}, function(err,college) {
					res.render('frontend/profpage',{
						professor: profData,
						college: college.toObject(),
						reviews: reviews,
						jumbotronImage: '/assets/headers/profpage_header.jpg',
						jumbotronHeader: profData.profName,
						jumbotronMessage: 'An exemplary Lasallian educator who teach minds, touch hearts, and transform lives by diligently teaching ' + profData.profCourse + ' from the ' + college.longName + '.',
						jumbotronLink: '/',
						jumbotronBtn: 'Back to Homepage',
						title: profData.profName
					});
				});
 			});
		}
	});
});

app.post('/addReview', function(req, res) {

  var newReview = new reviewModel({
  	profRef: req.body.profRef,
    profName: req.body.profName,
    profNumber: req.body.profNumber,
    profCourse: req.body.profCourse,
    studentRef: req.body.studentRef,
    studentId: req.body.studentId,
    reviewContent: req.body.reviewContent,
  });

  newReview.save(function(err, review) {
    var result;

    if (err) {
      console.log(err.errors);

      result = { success: false, message: "Review was not created!" }
      res.send(result);
    } else {
      console.log("Successfully added review!");
      console.log(review);

      result = { success: true, message: "Review created!" }

      res.send(result);
    }

  });
});

app.get('/reviews/:id', function(req,res){
	const link = req.params.id;

	reviewModel.findOne({_id: link}).populate('profRef').populate('studentRef').exec(function(err, review){
		if(review === null){
			res.render('frontend/error',{
				title: '404',
	  			status: '404'
			});
		}
		else{
			collegeModel.findOne({shortName: review.profRef.college}, function(err,college) {
				res.render('frontend/revpage', {
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
		}
	}); 
});

app.get('/profile', function(req, res){
	reviewModel.find({studentId: 11712074}).populate('profRef').populate('studentRef').sort({_id:-1}).exec(function(err,result) {
	 	var reviews = [];

		result.forEach(function(document){
			reviews.push(document.toObject());
		});

		res.render('frontend/profile',{
			reviews: reviews,
			title: 'Profile',
			jumbotronImage: '/assets/headers/user_header.jpg',
			jumbotronHeader: 'Hello Jolson,' ,
			jumbotronMessage: "This page shows your most recent contribution to the DLSU Community Forum. You may also change your password through the form below.",
			jumbotronBtn: 'Back to Homepage',
			jumbotronLink: '/'
		});
	});
});

app.get('/getCourseByCollege', function(req, res) {
	var selectedCollege = req._parsedUrl.query;
		
	professorModel.find({ college: selectedCollege }).distinct('profCourse', function(err, result) {
		res.send(result);
	});
});
	
app.get('/getProfByCourse', function(req, res) {
	var selectedCourse = req._parsedUrl.query;
	
	professorModel.find({ profCourse: selectedCourse }).distinct('profName', function(err, result) {
		res.send(result);
	});
});

app.get('/cf-admin', function(req,res) {
	collegeModel.countDocuments({}, function(err, collegeCount){
		reviewModel.countDocuments({}, function(err, reviewCount){
			professorModel.countDocuments({}, function(err, professorCount){
				userModel.countDocuments({}, function(err, userCount){
					res.render('backend/admin',{
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
});

app.get('/cf-admin/colleges', function(req,res) {
	res.render('backend/colleges',{
		title: 'College Panel',
		layout: 'backend',
		jumbotronImage: '/assets/headers/admin_header.jpg',
		jumbotronHeader: 'College Panel',
		jumbotronMessage: 'Welcome to the college panel. This page has the ultimate power to add, edit, and delete any college page found inside the Community Forum.',
		jumbotronLink: '/cf-admin',
		jumbotronBtn: 'Back to Dashboard'
	});
});

app.get('/cf-admin/reviews', function(req,res) {
	res.render('backend/reviews',{
		title: 'Review Panel',
		layout: 'backend',
		jumbotronImage: '/assets/headers/admin_header.jpg',
		jumbotronHeader: 'Review Panel',
		jumbotronMessage: 'Welcome to the Review’s Panel. This page has the capacity to edit any review and also delete certain reviews located in the DLSU Community Forum.',
		jumbotronLink: '/cf-admin',
		jumbotronBtn: 'Back to Dashboard'
	});
});

app.get('/cf-admin/professors', function(req,res) {
	res.render('backend/professors',{
		title: 'Professor Panel',
		layout: 'backend',
		jumbotronImage: '/assets/headers/admin_header.jpg',
		jumbotronHeader: 'Professor Panel',
		jumbotronMessage: 'Welcome to the Professor Panel. This page is not only for adding and deleting a professor but it also has the capability to edit the professor’s information and the course that they are currently teaching.',
		jumbotronLink: '/cf-admin',
		jumbotronBtn: 'Back to Dashboard'
	});
});

app.get('/cf-admin/users', function(req,res) {
	res.render('backend/users',{
		title: 'User Panel',
		layout: 'backend',
		jumbotronImage: '/assets/headers/admin_header.jpg',
		jumbotronHeader: 'User Panel',
		jumbotronMessage: 'Welcome to the User Panel. This page has the ability to add, ban and delete a user participating inside the community forum while also having the freedom to update the user information.',
		jumbotronLink: '/cf-admin',
		jumbotronBtn: 'Back to Dashboard'
	});
});

app.listen(app.get('port'), function(){
	console.log('Server started on port ' + app.get('port'));
});

app.use(function (req, res, next) {
  res.status(404).render('frontend/error',{
  	title: '404',
  	status: '404'
  });
});

app.use(function (req, res, next) {
  res.status(500).render('frontend/error',{
  	title: '500',
  	status: '500'
  });
});

//Testers

/*
app.get('/professors/addOne', function(req, res){
	var prof = new professorModel({
		college: "CLA",
		gender: "Male",
		profAge: "Mark Anthony Dacela",
		profCourse: "GEETHIC"
  	});

  	prof.save(function(err, res) {
    	console.log(prof);
	});
});
*/

/*
app.get('/professors/testSort', function(req,res){
	userModel.find({}, null, {sort: {_id: -1}}).exec(function(err,result){
		console.log(result);
	});
});
*/