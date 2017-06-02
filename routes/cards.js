const express = require('express');
const router = express.Router();
const Cards = require('../models/Cards');


/**
 * 
 * Creates or updates a card, if not created then a new one is created
 * 
 * @param  {String}   userId   User Id of the card
 * @param  {Object}   data     Data object
 *                             {
 *                                 type: <String>,
 *                                 cardId: <String>
 *                             }
 * @param  {Function} callback Callback function to handle the response of db
 * 
 */
function createOrUpdateCard(userId, data, callback) {
    Cards.findOne({
        userId: userId
    }, function (cardFetchError, fetchedCard) {
        if (cardFetchError) {
            res.status(500).json(cardFetchError);
            return;
        } else if (!fetchedCard) {

            let cardObj = new Cards();
            cardObj[data.type] = 1;
            cardObj.addedCards = [data.cardId];
            cardObj['userId'] = userId;
            cardObj.save(function (cardSaveError, savedCard) {
                if (cardSaveError) {
                    callback({
                        status: 500,
                        error: cardSaveError
                    });
                } else {
                    callback(null, savedCard);
                }
            })
        } else {

            var currentValue = fetchedCard[data.type] || 0;
            fetchedCard[data.type] = currentValue + 1;
            fetchedCard.addedCards.push(data.cardId);
            fetchedCard.save(function (cardUpdateError, updatedCard) {
                callback(null, updatedCard);
                return;
            });
        }
    });
}

/**
 * 
 * Function to fetch card of a particular user
 * 
 * @param  {String}   userId   User ID of the person whose cards needs to be fetched
 * @param  {Function} callback Callback function to handle the response data from db
 * 
 */
function fetchCard(userId, callback) {
    Cards.findOne({
        userId: userId
    }, function (cardFetchError, fetchedCard) {
        if (cardFetchError) {
            callback({
                status: 500,
                error: cardFetchError
            });
        } else if (!fetchedCard) {
            callback({
                status: 404,
                info: 'No cards found'
            });
        } else {
            callback(null, fetchedCard);
        }
    });
}

/**
 * 
 * Function to delete a card of a user
 * 
 * @param  {String}   userId   User ID whose card needs to be deleted
 * @param  {Function} callback Callback function to handle response from database
 */
function deleteCard(userId, callback) {
    Cards.findOne({
        userId: userId
    }, function (cardFetchError, fetchedCard) {
        if (cardFetchError) {
            callback({
                status: 500,
                error: cardFetchError
            });
        } else if (!fetchedCard) {
            callback({
                status: 404,
                info: 'No cards found'
            });
        } else {
            fetchedCard.remove();
            callback(null, {
                info: 'Deleted Successfully'
            });
        }
    });
}


router.post('/', function (req, res, next) {
    createOrUpdateCard(req.user._id, req.body, function(error, data) {
        if (error) {
            res.status(error.status || 500).json(error);
        } else {
            res.status(201).json(data);
        }
    })
});

router.get('/', function (req, res, next) {
    fetchCard(req.user._id, function(error, data) {
        if (error) {
            res.status(error.status || 500).json(error);
        } else {
            res.status(200).json(data);
        }
    });
});

router.delete('/', function (req, res, next) {
    deleteCard(req.user._id, function(error, data) {
        if (error) {
            res.status(error.status || 500).json(error);
        } else {
            res.status(200).json(data);
        }
    });
});

module.exports = router;
