var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
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
router.use(function(req, res, next) {
    console.log("something is happeniningin.");

    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
    console.log("we are in router.get() function");
    if(Object.keys(req.query).length === 0 && req.query.constructor === Object){
        console.log("empty object or not a object")
        res.status(404);
        res.json({
            error: "404: Empty request",
            result: null
        })
    }
    else {
        console.log("not an empty object")
        queryHandler.serviceQuery(req.query, function (error, result) {
            console.log(result);
            if (result.collections) {
                console.log("querying collections")
                db.queryTables(function (error, result) {
                    res.json({
                        error: error,
                        result: result
                    });
                });
            }
            else {
                if (result.cultureType) {
                    console.log("querying cultureYtpe");
                    db.queryCultures(result.collection, result.cultureType, function (error, result) {
                        res.json({
                            error: error,
                            result: result
                        })
                    })
                }
                else if (result.culture) {
                    console.log("querying culture")
                    var culture = result.culture;
                    db.queryGenerations(result.collection, culture, function (error, result) {
                        console.log("#@@@@@@@@@@@@@@@@@   ", culture);
                        res.json({
                            error: error,
                            culture: culture,
                            result: result
                        })
                    })
                }
                else{
                    console.log("errrrrorr")
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



// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use(express.static(path.join(__dirname, 'templates')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.get('/', function(req,res) {
    res.sendFile(path.join('index.html'));
});

// starts server
app.listen(port, function() {
    console.log(__dirname);
    console.log('App listening on port 3001!');
});


