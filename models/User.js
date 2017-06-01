var mongoose = require('mongoose');

var UserModel = {
	name: String,
	email: String,
	age: Number,
	password: String
}

module.exports = mongoose.model('User', UserModel);