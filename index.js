const mongodb = require('mongodb');
const express = require('express');
const sassMiddleware = require('node-sass-middleware');
const path = require('path');
const hbs = require('express-handlebars');
const app = express();

const mongoClient = mongodb.MongoClient;
const databaseURL = "mongodb+srv://admin:admin@commforumdb-df0ls.mongodb.net/test";
const dbname = "commforumdb";

const options = { useUnifiedTopology: true };

app.set('view engine', 'hbs');

app.engine('hbs',hbs({
	extname: 'hbs',
	helpers: {
        ifCond: function(v1, v2, options) {
		  if(v1 === v2) {
		    return options.fn(this);
		  }
		  return options.inverse(this);
		}
    },
	defaultView: 'main',
	layoutsDir: __dirname + '/views/layouts/',
	partialsDir: __dirname + '/views/partials/'
}));

app.set('port', (process.env.PORT || 3000));

app.use(sassMiddleware({
    /* Options */
    src: __dirname + '/public/scss',
    dest: __dirname + '/public/css',
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/css'
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	mongoClient.connect(databaseURL, options, function(err, client) {
	    if(err) throw err;
	    const dbo = client.db(dbname);

	    dbo.collection("professor").aggregate([{ $sample: { size: 3 } }]).toArray(function(err, result) {
	      if(err) throw err;
	  
	      console.log("Read Successful!");
	      client.close();
	      res.render('home',{
	      	quickView: result,
			title: 'Home',
			jumbotronCustom: "background-image: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.9) 100%), url('/assets/home_header.jpg')",
			jumbotronHeader: 'Welcome to CommForum',
			jumbotronMessage: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut perspiciatis maxime veniam facere, libero ducimus in nostrum. Nam quam aliquam eos amet, error enim iste a facilis minima voluptatum quo!',
			jumbotronLink: '/colleges',
			jumbotronBtn: 'View Colleges'
	      });
	    });
  	});
});


app.get('/colleges', function(req, res){
	mongoClient.connect(databaseURL, options, function(err, client) {
	    if(err) throw err;
	    const dbo = client.db(dbname);

	    dbo.collection("professor").distinct("college").then(function(result){
	    	res.render('colleges',{
	    		college: result,
				title: 'Colleges',
				jumbotronCustom: "background-image: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.9) 100%), url('/assets/college_header.jpg')",
				jumbotronHeader: 'Colleges',
				jumbotronMessage: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut perspiciatis maxime veniam facere, libero ducimus in nostrum. Nam quam aliquam eos amet, error enim iste a facilis minima voluptatum quo!',
				jumbotronLink: '/professors',
				jumbotronBtn: 'View Professors'
			});
	    });
  	});
});

app.get('/colleges/cla', function(req, res){
	res.render('colleges/cla',{
		title: 'CLA',
		jumbotronCustom: "background-image: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.9) 100%), url('/assets/college_header.jpg')",
		jumbotronHeader: 'College of Liberal Arts',
		jumbotronMessage: "The home of tomorrow's world leaders",
		jumbotronBtn: 'View CLA Professors',
		jumbotronLink: 'cla/professors'
	});
});

app.get('/colleges/cla/professors', function(req, res){
	mongoClient.connect(databaseURL, options, function(err, client) {
	    if(err) throw err;
	    // Connect to the same database
	    const dbo = client.db(dbname);

	    dbo.collection("professor").find({college: "CLA"}).toArray(function(err, result) {
	      if(err) throw err;
	  
	      console.log("Read Successful!");
	      client.close();
	      res.render('professors', {
	      	special: true,
	      	title: 'CLA Professors',
			jumbotronCustom: "background-image: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.9) 100%), url('/assets/college_header.jpg')",
			jumbotronHeader: 'Professors',
			jumbotronMessage: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut perspiciatis maxime veniam facere, libero ducimus in nostrum. Nam quam aliquam eos amet, error enim iste a facilis minima voluptatum quo!',
			jumbotronLink: '/',
			jumbotronBtn: 'Back to Homepage',
	        professor: result,
	      });
	    });
  	});
});

app.get('/colleges/cob', function(req, res){
	res.render('colleges/cob',{
		title: 'COB',
		jumbotronCustom: "background-image: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.9) 100%), url('/assets/college_header.jpg')",
		jumbotronHeader: 'College of Business',
		jumbotronMessage: "The home of tomorrow's world leaders",
		jumbotronBtn: 'View COB Professors',
		jumbotronLink: 'cob/professors'
	});
});

app.get('/colleges/cob/professors', function(req, res){
	mongoClient.connect(databaseURL, options, function(err, client) {
	    if(err) throw err;
	    // Connect to the same database
	    const dbo = client.db(dbname);

	    dbo.collection("professor").find({college: "COB"}).toArray(function(err, result) {
	      if(err) throw err;
	  
	      console.log("Read Successful!");
	      client.close();
	      res.render('professors', {
	      	special: true,
	      	title: 'COB Professors',
			jumbotronCustom: "background-image: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.9) 100%), url('/assets/college_header.jpg')",
			jumbotronHeader: 'Professors',
			jumbotronMessage: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut perspiciatis maxime veniam facere, libero ducimus in nostrum. Nam quam aliquam eos amet, error enim iste a facilis minima voluptatum quo!',
			jumbotronLink: '/',
			jumbotronBtn: 'Back to Homepage',
	        professor: result,
	      });
	    });
  	});
});

app.get('/colleges/coe', function(req, res){
	res.render('colleges/coe',{
		title: 'COE',
		jumbotronCustom: "background-image: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.9) 100%), url('/assets/college_header.jpg')",
		jumbotronHeader: 'College of Engineering',
		jumbotronMessage: "The home of tomorrow's world leaders",
		jumbotronBtn: 'View COE Professors',
		jumbotronLink: 'coe/professors'
	});
});

app.get('/colleges/coe/professors', function(req, res){
	mongoClient.connect(databaseURL, options, function(err, client) {
	    if(err) throw err;
	    // Connect to the same database
	    const dbo = client.db(dbname);

	    dbo.collection("professor").find({college: "COE"}).toArray(function(err, result) {
	      if(err) throw err;
	  
	      console.log("Read Successful!");
	      client.close();
	      res.render('professors', {
	      	special: true,
	      	title: 'COE Professors',
			jumbotronCustom: "background-image: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.9) 100%), url('/assets/college_header.jpg')",
			jumbotronHeader: 'Professors',
			jumbotronMessage: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut perspiciatis maxime veniam facere, libero ducimus in nostrum. Nam quam aliquam eos amet, error enim iste a facilis minima voluptatum quo!',
			jumbotronLink: '/',
			jumbotronBtn: 'Back to Homepage',
	        professor: result,
	      });
	    });
  	});
});

app.get('/colleges/ced', function(req, res){
	res.render('colleges/ced',{
		title: 'CED',
		jumbotronCustom: "background-image: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.9) 100%), url('/assets/college_header.jpg')",
		jumbotronHeader: 'College of Education',
		jumbotronMessage: "The home of tomorrow's world leaders",
		jumbotronBtn: 'View CED Professors',
		jumbotronLink: 'ced/professors'
	});
});

app.get('/colleges/ced/professors', function(req, res){
	mongoClient.connect(databaseURL, options, function(err, client) {
	    if(err) throw err;
	    // Connect to the same database
	    const dbo = client.db(dbname);

	    dbo.collection("professor").find({college: "CED"}).toArray(function(err, result) {
	      if(err) throw err;
	  
	      console.log("Read Successful!");
	      client.close();
	      res.render('professors', {
	      	special: true,
	      	title: 'CED Professors',
			jumbotronCustom: "background-image: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.9) 100%), url('/assets/college_header.jpg')",
			jumbotronHeader: 'Professors',
			jumbotronMessage: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut perspiciatis maxime veniam facere, libero ducimus in nostrum. Nam quam aliquam eos amet, error enim iste a facilis minima voluptatum quo!',
			jumbotronLink: '/',
			jumbotronBtn: 'Back to Homepage',
	        professor: result,
	      });
	    });
  	});
});

app.get('/colleges/ccs', function(req, res){
	res.render('colleges/ccs',{
		title: 'CCS',
		jumbotronCustom: "background-image: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.9) 100%), url('/assets/college_header.jpg')",
		jumbotronHeader: 'College of Computer Studies',
		jumbotronMessage: "The home of tomorrow's world leaders",
		jumbotronBtn: 'View CCS Professors',
		jumbotronLink: 'ccs/professors'
	});
});

app.get('/colleges/ccs/professors', function(req, res){
	mongoClient.connect(databaseURL, options, function(err, client) {
	    if(err) throw err;
	    // Connect to the same database
	    const dbo = client.db(dbname);

	    dbo.collection("professor").find({college: "CCS"}).toArray(function(err, result) {
	      if(err) throw err;
	  
	      console.log("Read Successful!");
	      client.close();
	      res.render('professors', {
	      	special: true,
	      	title: 'CCS Professors',
			jumbotronCustom: "background-image: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.9) 100%), url('/assets/college_header.jpg')",
			jumbotronHeader: 'Professors',
			jumbotronMessage: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut perspiciatis maxime veniam facere, libero ducimus in nostrum. Nam quam aliquam eos amet, error enim iste a facilis minima voluptatum quo!',
			jumbotronLink: '/',
			jumbotronBtn: 'Back to Homepage',
	        professor: result,
	      });
	    });
  	});
});

app.get('/colleges/cos', function(req, res){
	res.render('colleges/cos',{
		title: 'COS',
		jumbotronCustom: "background-image: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.9) 100%), url('/assets/college_header.jpg')",
		jumbotronHeader: 'College of Science',
		jumbotronMessage: "The home of tomorrow's world leaders",
		jumbotronBtn: 'View COS Professors',
		jumbotronLink: 'cos/professors'
	});
});

app.get('/colleges/cos/professors', function(req, res){
	mongoClient.connect(databaseURL, options, function(err, client) {
	    if(err) throw err;
	    // Connect to the same database
	    const dbo = client.db(dbname);

	    dbo.collection("professor").find({college: "COS"}).toArray(function(err, result) {
	      if(err) throw err;
	  
	      console.log("Read Successful!");
	      client.close();
	      res.render('professors', {
	      	special: true,
	      	title: 'COS Professors',
			jumbotronCustom: "background-image: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.9) 100%), url('/assets/college_header.jpg')",
			jumbotronHeader: 'Professors',
			jumbotronMessage: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut perspiciatis maxime veniam facere, libero ducimus in nostrum. Nam quam aliquam eos amet, error enim iste a facilis minima voluptatum quo!',
			jumbotronLink: '/',
			jumbotronBtn: 'Back to Homepage',
	        professor: result,
	      });
	    });
  	});
});

app.get('/colleges/soe', function(req, res){
	res.render('colleges/soe',{
		title: 'SOE',
		jumbotronCustom: "background-image: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.9) 100%), url('/assets/college_header.jpg')",
		jumbotronHeader: 'School of Economics',
		jumbotronMessage: "The home of tomorrow's world leaders",
		jumbotronBtn: 'View SOE Professors',
		jumbotronLink: 'soe/professors'
	});
});

app.get('/colleges/soe/professors', function(req, res){
	mongoClient.connect(databaseURL, options, function(err, client) {
	    if(err) throw err;
	    // Connect to the same database
	    const dbo = client.db(dbname);

	    dbo.collection("professor").find({college: "SOE"}).toArray(function(err, result) {
	      if(err) throw err;
	  
	      console.log("Read Successful!");
	      client.close();
	      res.render('professors', {
	      	special: true,
	      	title: 'SOE Professors',
			jumbotronCustom: "background-image: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.9) 100%), url('/assets/college_header.jpg')",
			jumbotronHeader: 'Professors',
			jumbotronMessage: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut perspiciatis maxime veniam facere, libero ducimus in nostrum. Nam quam aliquam eos amet, error enim iste a facilis minima voluptatum quo!',
			jumbotronLink: '/',
			jumbotronBtn: 'Back to Homepage',
	        professor: result,
	      });
	    });
  	});
});

app.get('/professors', function(req, res){
	mongoClient.connect(databaseURL, options, function(err, client) {
	    if(err) throw err;
	    // Connect to the same database
	    const dbo = client.db(dbname);

	    dbo.collection("professor").find({}).toArray(function(err, result) {
	      if(err) throw err;
	  
	      console.log("Read Successful!");
	      client.close();
	      res.render('professors', {
	      	title: 'Professors',
			jumbotronCustom: "background-image: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.9) 100%), url('/assets/college_header.jpg')",
			jumbotronHeader: 'Professors',
			jumbotronMessage: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut perspiciatis maxime veniam facere, libero ducimus in nostrum. Nam quam aliquam eos amet, error enim iste a facilis minima voluptatum quo!',
			jumbotronLink: '/',
			jumbotronBtn: 'Back to Homepage',
	        professor: result,
	      });
	    });
  });
});

app.get('/profile', function(req, res){
	res.render('profile',{
		title: 'Profile',
		jumbotronCustom: "background-image: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.9) 100%), url('/assets/college_header.jpg')",
		jumbotronHeader: 'Hello Jolson,' ,
		jumbotronMessage: "This page shows your most recent contribution to the DLSU Community Forum. You may also change your password through the form below.",
		jumbotronBtn: 'Back to Homepage',
		jumbotronLink: '/'
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