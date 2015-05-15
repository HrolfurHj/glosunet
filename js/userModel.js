var mongoose = require('mongoose-q')();

mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on('error', function () {
    console.error('MongoDB Connection Error. Make sure MongoDB is running');
});

var userSchema = new mongoose.Schema({
	name: String,
	id: String,
});


module.exports = mongoose.model('user', userSchema);