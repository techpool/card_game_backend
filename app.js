var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require("jwt-simple");
require('dotenv').config()
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('./models/User');

require('./config/database')();


var users = require('./routes/users');
var cards = require('./routes/cards');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST");
    next();
});


var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = 'secret';

passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    console.log('------------')
    console.log(jwt_payload)

    User.findOne({ id: jwt_payload.id }, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
            // or you could create a new account 
        }
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
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
app.use('/cards', passport.authenticate("jwt", { session: false }));
app.use('/cards', cards);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
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
