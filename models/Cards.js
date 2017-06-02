var mongoose = require('mongoose');

var CardModel = {
    spades: {
        type: Number,
        default: 0
    },
    hearts: {
        type: Number,
        default: 0
    },
    diamonds: {
        type: Number,
        default: 0
    },
    clubs: {
        type: Number,
        defualt: 0
    },
    addedCards: {
        type: Array,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}

module.exports = mongoose.model('Card', CardModel);
