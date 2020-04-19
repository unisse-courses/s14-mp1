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
	profRef: {type: ObjectId, ref: 'professor'},
	profNumber: {type: Int32},
	profCourse: {type: String},
	studentRef: {type: ObjectId, ref: 'user'},
	studentId: {type: Int32},
	reviewContent: {type: String}
});

module.exports = mongoose.model('review', reviewSchema);