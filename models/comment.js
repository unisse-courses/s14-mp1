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

var commentSchema = new Schema({
	reviewRef: {type: ObjectId, ref: 'review', required: true},
	studentRef: {type: ObjectId, ref: 'user', required: true},
	commentContent: {type: String, required: true},
});

const commentModel = mongoose.model('comment', commentSchema);

exports.getAll = function(query, next) {
	commentModel.find(query).populate('reviewRef').populate('studentRef').exec(function(err, result){
		if (err) throw err;
		var commentObject = [];

		result.forEach(function(document){
			commentObject.push(document.toObject());
		});

		next(commentObject);
	});
};

exports.getAllProfile = function(query, next) {
	commentModel.find(query).populate({path: 'reviewRef', model: 'review', populate: { path: 'profRef', model: 'professor'}}).populate('studentRef').sort({_id:-1}).exec(function(err, result){
		var commentObject = [];
		var comment;

		result.forEach(function(document){
			comment = document.toObject();
			comment['profDetails'] = document.reviewRef.profRef.toObject();
			commentObject.push(comment);
		});
		next(commentObject);
	});
};

exports.countAll = function(query) {
	return commentModel.countDocuments(query).populate('reviewRef').populate('studentRef');
};

exports.remove = function(query, next) {
	commentModel.deleteMany(query, function (err) {
		next(err);
	});
};