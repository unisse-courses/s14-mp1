const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Int32 = require('mongoose-int32');

const databaseURL = 'mongodb+srv://admin:admin@commforumdb-df0ls.mongodb.net/commforumdb';

const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
};

mongoose.connect(databaseURL, options);

var collegeSchema = new Schema({
	shortName: {type: String},
	longName: {type: String},
	logo: {type: String},
	contactUs:{
		telNum: {type: String},
		faxNum: {type: String},
		email: {type: String}
	},
	aboutUs: {type: Array},
	visionMission: {type: String},
	coreValues: {type: String},
	goals: {type: String},
	founderBio: {type: String},
	philosophy: {type: String},
	icon: {type: String}
});

const collegeModel = mongoose.model('college', collegeSchema);

exports.getLimited = function(query, limit, next) {
	collegeModel.find(query).limit(15).exec(function(err, result){
		if (err) throw err;
		var collegeObject = [];

		result.forEach(function(document){
			collegeObject.push(document.toObject());
		});

		next(collegeObject);
	});
};

exports.count = function(query, next) {
	collegeModel.countDocuments(query, function(err, result){
		if (err) throw err;
		next(result);
	});
};

exports.getAll = function(query, next) {
	collegeModel.find(query).exec(function(err, result){
		if (err) throw err;
		var collegeObject = [];

		result.forEach(function(document){
			collegeObject.push(document.toObject());
		});

		next(collegeObject);
	});
};

exports.getAllLean = function(query) {
	return collegeModel.find(query).lean().exec();
};

exports.getCollege = function(query, next) {
	collegeModel.findOne(query).exec(function(err, result){
		if (err) throw err;
		next(result);
	});
};