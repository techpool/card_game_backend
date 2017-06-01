var express = require('express');
var router = express.Router();
var Cards = require('../models/Cards');

/* GET users listing. */

router.post('/', function (req, res, next) {
    console.log(req.body);
    console.log(req.user);

    Cards.findOne({
    	userId: req.user._id
    }, function(cardFetchError, fetchedCard) {
    	if (cardFetchError) {
    		res.status(500).json(cardFetchError);
    		return;
    	} else if(!fetchedCard){

    		var cardObj = new Cards();

    		console.log(typeof String(req.user._id))
    		cardObj[req.body.type] = 1;
    		cardObj.addedCards = [req.body.cardId];
    		cardObj['userId'] = String(req.user._id);
    		cardObj.save(function(cardSaveError, savedCard) {
    			if (cardSaveError) {
    				res.status(500).json(cardSaveError);
    				return;
    			}
    		})
    	} else {

    		var currentValue = fetchedCard[req.body.type] || 0;
    		console.log(currentValue)

    		fetchedCard[req.body.type] = currentValue + 1;
    		fetchedCard.addedCards.push(req.body.cardId);
    		fetchedCard.save(function(cardUpdateError, updatedCard) {
    			res.status(201).json(updatedCard);
    			return;
    		});
    	}
    });
});

router.get('/', function (req, res, next) {
    console.log(req.body);
    console.log(req.user);

    Cards.findOne({
    	userId: req.user._id
    }, function(cardFetchError, fetchedCard) {
    	if (cardFetchError) {
    		res.status(500).json(cardFetchError);
    		return;
    	} else if(!fetchedCard){

    		res.status(404);
    	} else {

    		res.status(200).json(fetchedCard);
    	}
    });
});

router.delete('/', function (req, res, next) {
    console.log(req.body);
    console.log(req.user);

    Cards.findOne({
    	userId: req.user._id
    }, function(cardFetchError, fetchedCard) {
    	if (cardFetchError) {
    		res.status(500).json(cardFetchError);
    		return;
    	} else if(!fetchedCard){

    		res.status(404);
    	} else {
    		fetchedCard.remove();
    		res.status(200).json(fetchedCard);
    	}
    });
});

module.exports = router;
