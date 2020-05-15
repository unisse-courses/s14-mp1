//Import Models
const collegeModel = require('../models/college');
const professorModel = require('../models/professor');

exports.getAllColleges = function(req, res){
	if (req.session.loggedin){
		collegeModel.getAll({}, function(colleges){
		  	res.render('frontend/colleges',{
		  		session: req.session,
		  		data: colleges,
				title: 'Colleges',
				jumbotronImage: '/assets/headers/college_header.jpg',
				jumbotronHeader: 'Colleges',
				jumbotronMessage: 'De La Salle University has 7 Colleges with different specializations in which aims to hone the skills of diverse individuals in their track. These Colleges are each catered to developing the interior and exterior knowledge needed by an individual to be a fully-pledged Lasallian leader.',
				jumbotronLink: '/professors',
				jumbotronBtn: 'View Professors'
			});
		});
	} else{
		res.redirect('/login')
	}
};

exports.getCollegeData =  function(req, res){
	if (req.session.loggedin){
		const link = req.params.college.toUpperCase();

		collegeModel.getCollege({shortName: link}, function(college) {
			console.log(college);
			if(college === null){
				res.render('frontend/error',{
					session: req.session,
					error: '404',
	  				message: "The Page can't be found"
				});
			} else{
				res.render('frontend/colpage',{
					session: req.session,
					college: college.toObject(),
					jumbotronImage: '/assets/headers/colpage_header.jpg',
					jumbotronHeader: college.longName,
					jumbotronMessage: 'The ' + college.longName +' offers different degree programs in which aim to hone the skills of each individual and help them articulate the knowledge being dealt with them while striving to routerly the Lasallian Core Values, which will resemble the breeding ground for the future Lasallian leaders.',
					jumbotronLink: '/colleges/' + college.shortName + '/professors',
					jumbotronBtn: 'View ' + college.shortName + ' Professors',
					title: link
				});
			}
		});
	} else{
		res.redirect('/login');
	}
};

exports.getProfessors = function(req, res){
	if (req.session.loggedin){
		const link = req.params.college.toUpperCase();

		professorModel.getProfs({college: link}, function(professors){
			if(professors.length === 0){
				res.render('frontend/error',{
					session: req.session,
					error: '404',
	  				message: "The Page can't be found"
				});
			}
			else{
				res.render('frontend/professors',{
					session: req.session,
					professor: professors,
					title: link + ' Professors',
			      	jumbotronImage: '/assets/headers/colpage_header.jpg',
					jumbotronHeader: link + ' Professors',
					jumbotronMessage: 'The College of Liberal Arts has professors that promise to share all their knowledge and tools to effectively aid students in being graduates of their desired programs while embodying the Lasallian Core Values.',
					jumbotronLink: '/',
					jumbotronBtn: 'Back to Homepage',
				});
			}
		});
	} else{
		res.redirect('/login');
	}
};