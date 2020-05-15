const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Int32 = require('mongoose-int32');
const ObjectId = Schema.Types.ObjectId;

const databaseURL = 'mongodb+srv://admin:admin@commforumdb-df0ls.mongodb.net/commforumdb';

const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
};

mongoose.connect(databaseURL, options);

var reviewSchema = new Schema({
	profRef: {type: ObjectId, ref: 'professor', required: true},
	profNumber: {type: Int32, required: true},
	profCourse: {type: String, required: true},
	studentRef: {type: ObjectId, ref: 'user', required: true},
	studentId: {type: Int32, required: true},
	reviewContent: {type: String, required: true}
});

const reviewModel = mongoose.model('review', reviewSchema);

exports.getAll = function(query, next) {
	reviewModel.find(query).populate('profRef').populate('studentRef').sort({_id:-1}).exec(function(err,result){
		var reviewObject = [];

		result.forEach(function(document){
			reviewObject.push(document.toObject());
		});

		next(reviewObject);
	});
};


exports.getAllLean = function(query) {
	return reviewModel.find(query).populate('profRef').populate('studentRef').sort({_id:-1}).lean().exec();
};

exports.getRev = function(query, next) {
	reviewModel.findOne(query).populate('profRef').populate('studentRef').exec(function(err, result){
		if (err) throw err;
		next(result);
	});
};

exports.getLimited = function(limit, next) {
	reviewModel.find({}).populate('profRef').populate('studentRef').sort({_id:-1}).limit(limit).exec(function(err,result){
		if (err) throw err;
		var reviewObject = [];

		result.forEach(function(document){
			reviewObject.push(document.toObject());
		});

		next(reviewObject);
	});
};

exports.getProf = function(profRef, next) {
	reviewModel.find(profRef).populate('profRef').populate('studentRef').sort({_id:-1}).exec(function(err, result){
		if (err) throw err;
		var reviewObject = [];

		result.forEach(function(document){
			reviewObject.push(document.toObject());
		});

		next(reviewObject);
	});
};