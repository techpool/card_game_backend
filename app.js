const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require("jwt-simple");
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;

const users = require('./routes/users');
const cards = require('./routes/cards');

require('dotenv').config()
require('./config/database')();

const User = require('./models/User');

const passport = require('./config/passport')();

const app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST");
    next();
});


app.options('/login', function (req, res) {
    res.status(200).send();
})
app.post('/login', function (req, res, next) {
    if (req.body.username && req.body.password) {
        var username = req.body.username;
        var password = req.body.password;
        var user = User.findOne({ email: username }, function (userFetchError, fetchedUser) {
            if (userFetchError) {
                res.json(userFetchError);
            } else if (!fetchedUser) {
                res.status(400).json({
                    info: 'No user found'
                });
            } else {
                if (fetchedUser.password == password) {
                    var payload = {
                        id: user.id
                    };
                    var token = jwt.encode(payload, 'secret');
                    res.json({
                        token: 'JWT ' + token
                    });
                }
            }
        });
    } else {
        res.sendStatus(401);
    }
});

app.use('/users', users);
app.use(function (req, res, next) {
    console.log(req.headers);
    next();
})
app.options('/cards', function (req, res) {
    res.status(200).send();
})
app.use('/cards', passport.authenticate());
app.use('/cards', cards);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    console.log(err)
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});


module.exports = app;
