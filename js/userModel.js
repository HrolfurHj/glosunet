// Tengjast MongoDB

var mongoose = require('mongoose-q')();

mongoose.connect('mongodb://root:ax2owyxipI@proximus.modulusmongo.net:27017/py6syPab?autoReconnect=true&connectTimeoutMS=60000');
mongoose.connection.on('error', function () {
    console.error('MongoDB Connection Error. Make sure MongoDB is running');
});

// Model fyrir notendur

var userSchema = new mongoose.Schema({
	name: String,
	id: String,
	following: Array,
});


module.exports = mongoose.model('user', userSchema);