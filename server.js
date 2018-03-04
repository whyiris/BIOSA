var express = require('express');
var path = require('path');

//TODO make an icon for the website
var favicon = require('serve-favicon');

//TODO uploading samples for future features
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); // use for POST


var queryHandler = require('./scripts/query_handler');
var db = require('./scripts/db');

var app = express();
var port = process.env.PORT || 3001;


var router = express.Router();
// order matters
app.use('/query', router); // all of our routes will be prefixed with /query

// use res is talking back to client
router.use(function (req, res, next) {
    next();
});

router.get('/', function (req, res) {
    if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
        res.status(404);
        res.json({
            error: "404: Empty request",
            result: null
        })
    }
    else {
        queryHandler.serviceQuery(req.query, function (error, result) {
            if (result.collections) {
                db.queryTables(function (error, result) {
                    res.json({
                        error: error,
                        result: result
                    });
                });
            }
            else {
                if (result.cultureType) {
                    db.queryCultures(result.collection, result.cultureType, function (error, result) {
                        res.json({
                            error: error,
                            result: result
                        })
                    })
                }
                else if (result.culture) {
                    var culture = result.culture;
                    db.queryGenerations(result.collection, culture, function (error, result) {
                        res.json({
                            error: error,
                            culture: culture,
                            result: result
                        })
                    })
                }
                else {
                    res.status(404);
                    res.json({
                        error: "404: Bad Request",
                        result: null
                    })
                }
            }
        });
    }
});

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//TODO POST request for uploading files feature
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use(express.static(path.join(__dirname, 'templates')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.get('/', function (req, res) {
    res.sendFile(path.join('index.html'));
});

// starts server
app.listen(port, function () {
    console.log(__dirname);
    console.log('App listening on port 3001!');
});


