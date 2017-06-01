var mongoose = require('mongoose');

var CardModel = {
	spades: Number,
	hearts: Number,
	diamonds: Number,
	clubs: Number,
	addedCards: Array,
	userId: String
}

module.exports = mongoose.model('Card', CardModel);