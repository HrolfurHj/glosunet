// Tengjast MongoDB

var mongoose = require('mongoose-q')();

mongoose.connect('mongodb://root:ax2owyxipI@proximus.modulusmongo.net:27017/py6syPab?autoReconnect=true&connectTimeoutMS=60000');
mongoose.connection.on('error', function () {
    console.error('MongoDB Connection Error. Make sure MongoDB is running');
});

// Model fyrir glósur

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