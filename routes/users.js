var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET users listing. */

router.post('/', function(req, res, next) {
	console.log(req.body);

	var userObj = new User({
		name: req.body.name,
		email: req.body.email,
		age: req.body.age,
		password: req.body.password
	});

	userObj.save(function(userSaveError, savedUser) {
		if (userSaveError) {
			res.status(500).json(userSaveError);
		} else {
			res.status(201).json(savedUser);
		}
	})

});

module.exports = router;
