//Import Models
const collegeModel = require('../models/college');
const professorModel = require('../models/professor');

exports.find =  function (req, res) {
	if (req.session.loggedin){
		var searchItem =  '.*' + req.query.searchItem + '.*';

	  	professorModel.getLimited({profName: {$regex: searchItem, $options: 'i'}}, 15, function(professors){
	  		collegeModel.getLimited({$or: [ {longName: {$regex: searchItem, $options: 'i'}},{shortName: {$regex: searchItem, $options: 'i'}} ]}, 15, function(colleges){
	  			res.render('frontend/searchpage',{
					session: req.session,
					professors: professors,
					colleges: colleges,
					title: "Search Result for '" + req.query.searchItem + "'",
					jumbotronImage: '/assets/headers/college_header.jpg',
					jumbotronHeader: "Search Result for '" + req.query.searchItem + "'",
					jumbotronLink: '/',
					jumbotronBtn: 'Return to Homepage'
				});
	  		});
	  	});
	} else{
		res.redirect('/login');
	}
};