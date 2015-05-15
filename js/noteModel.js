var mongoose = require('mongoose-q')();

mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on('error', function () {
    console.error('MongoDB Connection Error. Make sure MongoDB is running');
});

var noteSchema = new mongoose.Schema({
	title: String,
	content: String,
	desc: String,
	author: String,
	authorID: String,
	date: String,
	tags: Array
});
module.exports = mongoose.model('note', noteSchema);