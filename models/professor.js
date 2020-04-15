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

var professorSchema = new Schema({
	profNumber: {type: Int32},
	college: {type: String},
	gender: {type: String},
	profCourse: {type: String},
});

module.exports = mongoose.model('professor', professorSchema, 'professor');