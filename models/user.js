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

var userSchema = new Schema({
	studentName: {type: String, required: true},
	studentId: {type: Int32, required: true},
	password: {type: String, required: true},
	isAdmin: {type: Boolean, required: true},
	isBanned: {type: Boolean, required: true}
});

const userModel = mongoose.model('user', userSchema, 'user');

exports.getAllLean = function(query) {
	return userModel.find(query).lean().sort({_id:1}).exec();
};

exports.count = function(query, next) {
	userModel.countDocuments(query, function(err, result){
		if (err) throw err;
		next(result);
	});
};

exports.getAllLean = function(query) {
	return userModel.find(query).lean().sort({_id:1}).exec();
};

exports.pullProfile = function(query, next) {
	userModel.findOne(query).exec(function(err, result){
		if (err) throw err;
		next(result);
	});
};