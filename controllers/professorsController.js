//Import Models
const collegeModel = require('../models/college');
const professorModel = require('../models/professor');
const reviewModel = require('../models/review');

exports.getAllProfs = function(req, res){
	if (req.session.loggedin){
		professorModel.getAll({profName: 1}, function(professors){
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
					title: 'Professors',
			      	jumbotronImage: '/assets/headers/colpage_header.jpg',
					jumbotronHeader: 'Professors',
					jumbotronMessage: 'The Professors of De La Salle University aims to provide all the students with the necessary learning tools in obtaining knowledge to maximize all the skills and talents one must possess before being deployed to their chosen careers.',
					jumbotronLink: '/',
					jumbotronBtn: 'Back to Homepage',
				});
			}
		})
	} else{
		res.redirect('/login');
	}
};

exports.getProfData =  function(req, res){
	if (req.session.loggedin){
		const link = req.params.id;

		professorModel.getProf({profNumber: link}, function(professor){
			if(professor === null){
				res.render('frontend/error',{
					session: req.session,
					error: '404',
	  				message: "The Page can't be found"
				});
			}
			else{
				console.log(professor);
				var profData = professor.toObject();
				reviewModel.getProf({profRef: profData._id}, function(reviews){
					collegeModel.getCollege({shortName: profData.college}, function(college){
						res.render('frontend/profpage',{
							session: req.session,
							studentRef: req.session.studentRef,
							studentId: req.session.idNum,
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
	} else{
		res.redirect('/login');
	}
}

exports.addProf = function(req, rest){

	var newProfessor = new professorModel({
    	profName: req.body.profName,
    	gender: req.body.gender,
    	college: req.body.college,
    	profCourse: req.body.profCourse
	});

	professorModel.create(newProfessor, function(err, newProfessor ){
		if (err) {
			console.log(err.errors);
		    result = { success: false, message: "Professor was not added!" }
		    res.send(result);
		} else {
			console.log("Successfully added professor!");
			console.log(newProfessor);
			result = { success: true, message: "Professor has succesfully been added!" }
			res.send(result);
		}
	});
}