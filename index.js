//Package Dependencies
var mongodb = require('mongodb');
var express = require('express');
var sassMiddleware = require('node-sass-middleware');
var path = require('path');
var hbs = require('express-handlebars');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var bcrypt = require('bcrypt');
var fileUpload = require('express-fileupload'); //npm i express-fileupload

//Import Routers
const rootRouter = require('./routes/rootRoutes');
const collegesRouter = require('./routes/collegesRoutes');
const professorsRouter = require('./routes/professorsRoutes');
const reviewsRouter = require('./routes/reviewsRoutes');
const profileRouter = require('./routes/profileRoutes');
const loginRouter = require('./routes/loginRoutes');
const logoutRouter = require('./routes/logoutRoutes');
const searchRouter = require('./routes/searchRoutes');
const cfAdminRouter = require('./routes/cfAdminRoutes')
const cfProfileRouter = require('./routes/cfProfileRoutes')

//Import Models
const collegeModel = require('./models/college');
const commentModel = require('./models/comment');
const professorModel = require('./models/professor');
const userModel = require('./models/user');
const reviewModel = require('./models/review');
const fallbackModel = require('./models/fallback');

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
		},
		json: function(context) {
    		return JSON.stringify(context);
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
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// Configuration for handling API endpoint data
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Route Definition
app.use('/', rootRouter);
app.use('/colleges', collegesRouter);
app.use('/professors', professorsRouter);
app.use('/reviews', reviewsRouter);
app.use('/profile', profileRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/search', searchRouter);
app.use('/cf-admin', cfAdminRouter);
app.use('/cf-profile', cfProfileRouter);

//Logical GET Methods
app.get('/getCourseByCollege', function(req, res) {
	var selectedCollege = req._parsedUrl.query;

	professorModel.find({ college: selectedCollege }).distinct('profCourse', function(err, result) {
		res.send(result);
	});
});

app.get('/getProfByCourse', function(req, res) {
	var selectedCourse = req._parsedUrl.query;

	professorModel.find({ profCourse: selectedCourse }).select('profName profNumber _id').exec(function(err, result) {
		res.send(result);
	});
});

app.get('/getProfDetails', function(req, res) {
	var data = req.query;

	professorModel.findOne({ profCourse: data.profCourse, profName: data.profName }).select('_id profNumber').exec(function(err, result) {
		res.send(result);
	});
});

app.get('/getSecQuestion', function(req, res){
	var id = req._parsedOriginalUrl.query;

	fallbackModel.findOne({studentId: id}, function(err, result){
		var data;
		if (err)
		{
			console.log(err.errors);
		}
		else {
			//console.log(result);

			if(result === null){
			   data = "No User Found!";
			}
			else{
				data = {
					question: result.question,
					answer: result.answer
				}
			}

			res.send(data);
		}
	});
});

app.get('/verifySecAnswer', function(req, res){
	var id = req.query.id;
	var answer = req.query.answer;

	//console.log(id + " "  + answer + " " + req.query);

	fallbackModel.findOne({studentId: id}, function(err, result){
		var data;
		if (err)
		{
			console.log(err.errors);
		}
		else {
			//console.log(result);

			if(result === null){
			  	data = "Answers mismatch!";
			}
			else{
				if( bcrypt.compareSync(answer, result.answer) ){
					data = true;
				}
				else{
			  		data = "Answers mismatch!";
				}
			}
			res.send(data);
		}
	});

});

//POST Methods
app.post('/setNewPassword', function(req, res) {

	var id = req.body.id;
	var password = req.body.password;
	console.log(id + " " + password);

	userModel.findOne({studentId: id}, function(err, doc){
		var result;
		if(err){
			console.log(err.errors);
			result = { success: false, message: "Password was not successfully changed!" }
			res.send(result);
		} else{
			doc.password = bcrypt.hashSync(password, 10);
			doc.save();
			console.log("Successfully changed password!");
			console.log(doc);
			result = { success: true, message: "Password changed!" }
			res.send(result);
		}
	});
});

app.post('/addSecurity', function (req, res){
	var newSecurity = new securityModel ({
		studentId: req.body.idNum,
		securityQ1: req.body.securityQ1,
        securityQ2: req.body.securityQ2,
        securityQ3: req.body.securityQ3
	});
	securityModel.findOne({studentId: newSecurity.studentId}, function(err){
		if (err) {
			console.log(err.errors);
			res.send(result);
		}
		else {
			newSecurity.save(function(err, data) {
				if (err){
					console.log(err.errors);
					res.send(result);
				}
				else {
					console.log('Security added Successfully');
					console.log(data);
					res.send(result);
				}
			});
		}
	});
});
app.post('/auth', function(req,res) {
	var user = {
    	studentId: req.body.studentId,
    	password: req.body.password,
	};

	userModel.pullProfile({studentId: user.studentId}, function(userQuery){
		//if (err) {
	//		console.log(err.errors);
	  //  	result = { success: false, message: "Error in DB validation!" }
	    //	res.send(result);
	//	}
		if (userQuery){
			console.log('User found!');
			if (bcrypt.compareSync(user.password, userQuery.password)) {
				req.session.nickname = userQuery.studentName.substr(0, userQuery.studentName.indexOf(' '));
				req.session.fullname = userQuery.studentName;
				req.session.studentRef = userQuery._id;
				req.session.idNum = userQuery.studentId;
				req.session.admin = userQuery.isAdmin;
				req.session.banned = userQuery.isBanned;
				req.session.loggedin = true;
				result = { status: 1, success: true, message: "Log In Succesfull! Redirecting you to homepage..." }
				res.send(result);
			} else {
				result = { status: 0, success: false, message: "Password incorrect! Please try again." }
				res.send(result);
			}
		} else {
			result = { status: -1, success: false, message: "Username not found! Please try again." }
			res.send(result);
		}
	});
});

app.post('/addUser', function(req, res) {
	var newUser = new userModel({
  		studentName: req.body.studentName,
    	studentId: req.body.studentId,
    	password: req.body.password,
    	isAdmin: req.body.isAdmin,
    	isBanned: false
	});

	userModel.findOne({studentId: newUser.studentId}, function(err1, userQuery){
		if (err1) {
			console.log(err1.errors);
	    	result = { success: false, message: "Error in DB validation!" }
	    	res.send(result);
		}
		if (userQuery){
			console.log('User found!');
			result = { success: false, message: "User already exists! Please sign in!" }
	    	res.send(result);
		} else{
			newUser.password = bcrypt.hashSync(newUser.password, 10);
			newUser.save(function(err2, user) {
				if (err2) {
					console.log(err2.errors);
	    			result = { success: false, message: "User was not registered!" }
	    			res.send(result);
				} else {
					console.log("Successfully registered user!");
	    			console.log(user);
	    			result = { success: true, message: "User has succesfully registered!" }
	    			res.send(result);
				}
			});
		}
	});
});

app.post('/addFallback', function (req, res){
	var hash = bcrypt.hashSync(req.body.securityA,10);
	var newSecurity = new fallbackModel ({
		studentId: req.body.idNum,
		question: req.body.securityQ,
        answer: hash
	});
	newSecurity.save(function(err, data) {
		var result;
		if (err){
			console.log(err.errors);
			result = {success: false};
			res.send(result);
		}
		else {
			console.log('Security added successfully');
			result = {success: true};
			console.log(data);
			res.send(result);
		}
	});
});

app.post('/addProfessor', function(req, res) {
	var newProfessor = new professorModel({
    	profName: req.body.profName,
    	gender: req.body.gender,
    	college: req.body.college,
    	profCourse: req.body.profCourse
	});

	newProfessor.save(function(err, user) {
		if (err) {
			console.log(err.errors);
		    result = { success: false, message: "Professor was not added!" }
		    res.send(result);
		} else {
			console.log("Successfully added professor!");
			console.log(user);
			result = { success: true, message: "Professor has succesfully been added!" }
			res.send(result);
		}
	});
});

app.post('/addComment', function(req, res) {
	if (req.session.banned){
		var result;
		result = { success: false, message: "Your account is BANNED!" }
		res.send(result);
	} else{
		var newComment = new commentModel({
			reviewRef: req.body.reviewRef,
		 	studentRef: req.body.studentRef,
		  	commentContent: req.body.commentContent,
		});

		newComment.save(function(err, comment) {
			var result;
			if (err) {
				console.log(err.errors);
				result = { success: false, message: "Comment was not posted!" }
				res.send(result);
		  	} else {
				console.log(comment);
				result = { success: true, message: "Comment posted!" }
				res.send(result);
		  	}
		});
	}
});

app.post('/saveComment', function(req, res) {
	if (req.session.banned){
		var result;
		result = { success: false, message: "Your account is BANNED!" }
		res.send(result);
	} else{
		var id = req.body.id;
		var content = req.body.content;

		commentModel.findOne({_id: id}, function(err, doc){
			var result;
			if(err){
				console.log(err.errors)
				result = { success: false, message: "Comment was not successfully saved!" }
				res.send(result);
			}
			else{
				doc.commentContent = content;
				doc.save();
				console.log("Successfully saved comment!");
				console.log(doc);
				result = { success: true, message: "Comment saved!" }
				res.send(result);
			}
		});
	}
});

app.post('/editProfessor', function (req,res) {
	var id = req.body.id;
	var name = req.body.name;
	var course = req.body.course;
	var college = req.body.college;
	var gender = req.body.gender;
	//console.log(name);

	professorModel.findOne({_id: id}, function(err, data){
		var result;
		if (err){
			console.log(err.errors)
			result = { success: false, message: "Professor was not successfully saved!" }
			res.send(result);
		}
		else{
			data.profName = name;
			data.profCourse = course;
			data.college = college;
			data.gender = gender;
			data.save();
			console.log(data);
			result = { success: true, message: "Professor saved!" }
			res.send(result);
		}
	});
});

app.post('/banUser', function (req,res) {
	var id = req.body.id;
	console.log(id);
	userModel.findOne({_id: id}, function(err, data) {
		var result;
			if(err){
				console.log(err.errors)
				result = { success: false, message: "User was not successfully banned!" }
				res.send(result);
			}
			else{
				data.isBanned = true;
				data.save();
				console.log("User successfully banned!");
				console.log(data);
				result = { success: true}
				res.send(result);
			}
	});
});

app.post('/deleteProf', function(req, res) {
	var id = req.body.id;
	reviewModel.deleteMany({ profRef: id}, function (err){
		if(err){
			console.log(err.errors);
			result = {
				success: false,
				message: "Professor were not successfully deleted!"
			}
			res.send(result);
		} else{
			professorModel.deleteOne({ _id: id }, function (err) {
				if(err){
					console.log(err.errors);
					result = { success: false, message: "Professor was not successfully deleted!" }
					res.send(result);
				} else {
					console.log("Successfully deleted professor!");
					result = { success: true, message: "Professor deleted!" }
					res.send(result);
				}
			});
	  	}
	})
 });

app.post('/deleteComment', function (req, res) {
	var id = req.body.id;
	commentModel.deleteOne({ _id: id }, function (err) {
		if (err) {
			console.log(err.errors);
			result = {
				success: false,
				message: "Comment was not successfully deleted!"
			}
			res.send(result);
		} else {
			console.log("Successfully deleted comment!");
			result = {
				success: true,
				message: "Comment deleted!"
			}
			res.send(result);
		}
	});
});

app.post('/deleteUser', function (req, res) {
	var id = req.body.id;
	userModel.deleteOne({ _id: id }, function (err) {
		if (err) {
			console.log(err.errors);
			result = {
				success: false,
				message: "User was not successfully deleted!"
			}
			res.send(result);
		} else {
			console.log("Successfully deleted user!");
			result = {
				success: true,
				message: "User deleted!"
			}
			res.send(result);
		}
	});
});

app.post('/deleteCollege', function (req, res) {

	var id = req.body.id;

	collegeModel.deleteOne({ _id: id }, function (err) {

		if (err) {
			console.log(err.errors);

			result = {
				success: false,
				message: "College was not successfully deleted!"
			}
			res.send(result);
		} else {
			console.log("Successfully deleted college!");

			result = {
				success: true,
				message: "College deleted!"
			}
			res.send(result);
		}
	});
});

app.use(fileUpload());

app.post('/addCollege', function (req, res) {
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send('No files were uploaded.');
	} else {
		var fileName = req.body.shortName;
		var sampleFile = req.files.collegeLogo;
		var ext = '.jpg';

		if (sampleFile.mimetype == 'image/png')
			ext = '.png'

		sampleFile.mv(__dirname + '/public/assets/colleges/' + fileName + ext, function (err) {
			if (err) {
				return res.status(500).send(err);
			} else {

				var newCollege = new collegeModel({
						shortName: req.body.shortName,
					 	longName: req.body.longName,
					 	logo: '/assets/colleges/' + fileName + ext,
					 	contactUs:{
							telNum: req.body.telNum,
							faxNum: req.body.faxNum
						},
						aboutUs: req.body.aboutUs
					});

				newCollege.save(function(err, comment) {

				});
			}
			res.redirect('/cf-admin/colleges');
		});
	}
});

app.post('/changePassword', function (req, res) {
	var studentRef = req.session.studentRef;
	var credentials = {
    	currentPassword: req.body.oldPassword,
    	newPassword: req.body.newPassword,
	};

	userModel.findOne({_id: studentRef}, function(err, userQuery){
		console.log(userQuery);
		var result;
		if(err){
			console.log(err.errors)
			result = { success: false, message: "Password was not successfully changed!" }
			res.send(result);
		}
		else{
			if(bcrypt.compareSync(credentials.currentPassword, userQuery.password)){
				let hash = bcrypt.hashSync(credentials.newPassword,10);
  				credentials.newPassword = hash;
				userQuery.password = credentials.newPassword;
				userQuery.save();
				console.log("Successfully changed password!");
				console.log(userQuery);
				result = { success: true, message: "Password changed!" }
				res.send(result);
			} else{
				result = { success: false, message: "Current password incorrect! Please try again." }
				res.send(result);
			}
		}
	})
});

//HTTP Status Routes
app.use(function (req, res, next) {
  res.status(404).render('frontend/error',{
  	session: req.session,
  	error: '404',
  	message: "The Page can't be found"
  });
});

app.use(function (req, res, next) {
  res.status(500).render('frontend/error',{
  	session: req.session,
  	error: '500',
  	message: 'Internal Server Error'
  });
});

app.listen(app.get('port'), function(){
	console.log('Server started on port ' + app.get('port'));
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

/*
app.get('/testCount', async function(req, res) { // note the async keyword
	const collegeRes = await collegeModel.find({}).lean().exec() // .exec() returns a Promise, so you can `await` it.
	const resultPromises = collegeRes.map(async college => { // arrow function is equivalent to function in this context
    	const professorCount = await professorModel.countDocuments({ college: college.shortName });
    	college.count = professorCount;
    	return college;
  	});
  	const collegeObject = await Promise.all(resultPromises);
  	console.log(collegeObject);
});
*/
