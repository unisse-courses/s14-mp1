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

				res.render('home',{
					colleges: colleges,
			    	data: qvProfs,
			    	review: reviews,
					title: 'Home',
					jumbotronImage: '/assets/headers/home_header.jpg',
					jumbotronHeader: 'Welcome to CommForum',
					jumbotronMessage: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut perspiciatis maxime veniam facere, libero ducimus in nostrum. Nam quam aliquam eos amet, error enim iste a facilis minima voluptatum quo!',
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

	  	res.render('colleges',{
	  		data: collegeObjects,
			title: 'Colleges',
			jumbotronImage: '/assets/headers/college_header.jpg',
			jumbotronHeader: 'Colleges',
			jumbotronMessage: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut perspiciatis maxime veniam facere, libero ducimus in nostrum. Nam quam aliquam eos amet, error enim iste a facilis minima voluptatum quo!',
			jumbotronLink: '/professors',
			jumbotronBtn: 'View Professors'
		});
	});
});

app.get('/colleges/:college', function(req, res){
	const link = req.params.college.toUpperCase();

	collegeModel.findOne({shortName: link}, function(err, college) {
		if(college === null){
			res.render('error',{
				title: '404',
  				status: '404'
			});
		}
		else{
			res.render('colpage',{
				college: college.toObject(),
				jumbotronImage: '/assets/headers/colpage_header.jpg',
				jumbotronHeader: college.longName,
				jumbotronMessage: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut perspiciatis maxime veniam facere, libero ducimus in nostrum. Nam quam aliquam eos amet, error enim iste a facilis minima voluptatum quo!',
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
			res.render('error',{
				title: '404',
  				status: '404'
			});
		}
		else{
			res.render('professors',{
				professor: professorObject,
				title: link + ' Professors',
		      	jumbotronImage: '/assets/headers/colpage_header.jpg',
				jumbotronHeader: link + ' Professors',
				jumbotronMessage: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut perspiciatis maxime veniam facere, libero ducimus in nostrum. Nam quam aliquam eos amet, error enim iste a facilis minima voluptatum quo!',
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
			res.render('error',{
				title: '404',
  				status: '404'
			});
		}
		else{
			res.render('professors',{
				professor: professorObject,
				title: 'Professors',
		      	jumbotronImage: '/assets/headers/colpage_header.jpg',
				jumbotronHeader: 'Professors',
				jumbotronMessage: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut perspiciatis maxime veniam facere, libero ducimus in nostrum. Nam quam aliquam eos amet, error enim iste a facilis minima voluptatum quo!',
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
			res.render('error',{
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
					res.render('profpage',{
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

//IN

app.post('/addReview', function(req, res) {
  //console.log(req.body);

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

//OUT

app.get('/reviews/:id', function(req,res){
	const link = req.params.id;

	reviewModel.findOne({_id: link}).populate('profRef').populate('studentRef').exec(function(err, review){
		if(review === null){
			res.render('error',{
				title: '404',
	  			status: '404'
			});
		}
		else{
			collegeModel.findOne({shortName: review.profRef.college}, function(err,college) {
				res.render('revpage', {
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

		res.render('profile',{
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

app.listen(app.get('port'), function(){
	console.log('Server started on port ' + app.get('port'));
});

app.use(function (req, res, next) {
  res.status(404).render('error',{
  	title: '404',
  	status: '404'
  });
});

app.use(function (req, res, next) {
  res.status(500).render('error',{
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