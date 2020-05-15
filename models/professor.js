const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Int32 = require('mongoose-int32');
const autoIncrement = require('mongoose-auto-increment');

const databaseURL = 'mongodb+srv://admin:admin@commforumdb-df0ls.mongodb.net/commforumdb';

const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
};

mongoose.connect(databaseURL, options);

var connection = mongoose.createConnection(databaseURL, options);
autoIncrement.initialize(connection);

var professorSchema = new Schema({
	profNumber: {type: Int32, required: true},
	college: {type: String, required: true},
	gender: {type: String, required: true},
	profName: {type: String, required: true},
	profCourse: {type: String, required: true}
});

professorSchema.plugin(autoIncrement.plugin, {
    model: 'professor',
    field: 'profNumber',
    startAt: 36,
    incrementBy: 1
});

const professorModel = mongoose.model('professor', professorSchema, 'professor');

exports.getAll = function(sort, next) {
	professorModel.find({}).sort(sort).exec(function(err, result){
		if (err) throw err;
		var professorObject = [];

		result.forEach(function(document){
			professorObject.push(document.toObject());
		});

		next(professorObject);
	});
};

exports.find = function(query, limit next) {
	professorModel.find(query).limit(15).exec(function(err, result){
		if (err) throw err;
		var professorObject = [];

		result.forEach(function(document){
			professorObject.push(document.toObject());
		});

		next(professorObject);
	});
};

exports.getProf = function(profNum, next) {
	professorModel.findOne(profNum).exec(function(err, result){
		if (err) throw err;
		next(result);
	});
};

exports.getProfs = function(query, next) {
	professorModel.find(query).exec(function(err, result){
		if (err) throw err;
		var professorObject = [];

		result.forEach(function(document){
			professorObject.push(document.toObject());
		});

		next(professorObject);
	});
};

exports.getQuickView = function(sample, next) {
	professorModel.aggregate(sample).then(function(result){
		next(result)
	});
};
