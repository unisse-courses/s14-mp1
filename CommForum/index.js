var express = require('express');
var sassMiddleware = require('node-sass-middleware');
var path = require('path');
var hbs = require('express-handlebars');
var app = express();

app.set('view engine', 'hbs');

app.engine('hbs',hbs({
	extname: 'hbs',
	defaultView: 'main',
	layoutsDir: __dirname + '/views/layouts/',
	partialsDir: __dirname + '/views/partials/'
}));

app.set('port', (process.env.PORT || 9090));

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
	res.render('home',{
		title: 'Home',
		jumbotronCustom: "background-image: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.9) 100%), url('/assets/home_header.jpg')",
		jumbotronHeader: 'Welcome to CommForum',
		jumbotronMessage: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut perspiciatis maxime veniam facere, libero ducimus in nostrum. Nam quam aliquam eos amet, error enim iste a facilis minima voluptatum quo!',
		jumbotronLink: '/colleges',
		jumbotronBtn: 'View Colleges',
		/* TODO: Feed variables below with dynamic data from database*/
		/* TODO: Transform variables below to an array[3]*/
		p1Name: 'Dr. Conrado Ruiz',
		p1Image: '/assets/male_prof.png',
		p1Desc: 'A fulltime professor teaching CCPROG1 from the College of Computer Studies',
		p1Link: '/',
		p2Name: 'Ms. Unisse Chua',
		p2Image: '/assets/female_prof.png',
		p2Desc: 'A fulltime professor teaching CCAPDEV from the College of Computer Studies',
		p2Link: '/',
		p3Name: 'Dr. Oliver Malabanan',
		p3Image: '/assets/male_prof.png',
		p3Desc: 'A fulltime professor teaching CCINFOM from the College of Computer Studies',
		p3Link: '/'
	});
});

app.get('/colleges', function(req, res){
	res.render('colleges',{
		title: 'Colleges',
		jumbotronCustom: "background-image: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.9) 100%), url('/assets/college_header.jpg')",
		jumbotronHeader: 'Colleges',
		jumbotronMessage: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut perspiciatis maxime veniam facere, libero ducimus in nostrum. Nam quam aliquam eos amet, error enim iste a facilis minima voluptatum quo!',
		jumbotronLink: '/professors',
		jumbotronBtn: 'View Professors',
		/* TODO: Transform variables below to an array[7]*/
		c1Image: '/assets/cla.png',
		c1Name: 'College of Liberal Arts',
		c1Link: '/colleges/cla',
		c1Caption: 'View CLA page',
		c2Image: '/assets/cob.png',
		c2Name: 'College of Business',
		c2Link: '/colleges/cob',
		c2Caption: 'View COB page',
		c3Image: '/assets/coe.png',
		c3Name: 'College of Engineering',
		c3Link: '/colleges/coe',
		c3Caption: 'View COE page',
		c4Image: '/assets/ccs.png',
		c4Name: 'College of Computer Studies',
		c4Link: '/colleges/ccs',
		c4Caption: 'View CCS page',
		c5Image: '/assets/ced.png',
		c5Name: 'College of Education',
		c5Link: '/colleges/ced',
		c5Caption: 'View CED page',
		c6Image: '/assets/cos.png',
		c6Name: 'College of Science',
		c6Link: '/colleges/cos',
		c6Caption: 'View COS page',
		c7Image: '/assets/soe.png',
		c7Name: 'School of Economics',
		c7Link: '/colleges/soe',
		c7Caption: 'View SOE page'
	});
});

app.get('/colleges/cla', function(req, res){
	res.render('colleges/cla',{
		title: 'CLA',
		jumbotronCustom: "background-image: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.9) 100%), url('/assets/college_header.jpg')",
		jumbotronHeader: 'College of Liberal Arts',
		jumbotronMessage: "The home of tomorrow's world leaders",
		jumbotronBtn: 'View CLA Professors',
		jumbotronLink: 'colleges/cla/professors'
	});
});

app.get('/colleges/cob', function(req, res){
	res.render('colleges/cob',{
		title: 'COB'
	});
});

app.get('/colleges/coe', function(req, res){
	res.render('colleges/coe',{
		title: 'COE'
	});
});

app.get('/colleges/ced', function(req, res){
	res.render('colleges/ced',{
		title: 'CED'
	});
});

app.get('/colleges/ccs', function(req, res){
	res.render('colleges/ccs',{
		title: 'CCS'
	});
});

app.get('/colleges/cos', function(req, res){
	res.render('colleges/cos',{
		title: 'COS'
	});
});

app.get('/colleges/soe', function(req, res){
	res.render('colleges/soe',{
		title: 'SOE'
	});
});

app.listen(app.get('port'), function(){
	console.log('Server started on port ' + app.get('port'));
});

app.use(function (req, res, next) {
  res.status(404).render('error',{
  	status: '404'
  });
});