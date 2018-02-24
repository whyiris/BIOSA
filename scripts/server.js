var path = require("path");
var express = require('express');
var app = express();


app.use('/scripts',express.static(path.join(__dirname.slice(0,36), 'scripts')));
app.use('/styles',express.static(path.join(__dirname.slice(0,36), 'styles')));
// app.use('/templates',express.static(path.join(__dirname.slice(0,36), 'templates')))


app.get('/', function(req,res) {
    res.sendFile(path.join(__dirname.slice(0,36) + 'templates/table.html'));
});


app.get('/ajaxURL', function(req, res) {
    // retrieve module
    var MongoClient = require('mongodb').MongoClient;
    var cocultureDict = {};
    // connect to the db
    MongoClient.connect("mongodb://localhost", function(err, client) {
        if(err) throw err;
        var db = client.db('TEST_DB');
        var collection = db.collection('data1');

        // grab everything from a collection, we can't assume we know culture
        collection.find().toArray(function(err, result){
            if (err) throw err;

            // store generation for each new culture
            for(var i in result) {
                if(cocultureDict.hasOwnProperty(result[i].culture)) {
                    cocultureDict[result[i].culture].push(result[i].generation)
                }
                else {
                    cocultureDict[result[i].culture] = [result[i].generation]
                }
            }

            // sort the generation for each culture
            for(var i in cocultureDict) {
                cocultureDict[i].sort()
            }

            console.log(cocultureDict)
            res.send(cocultureDict);
        });
        client.close()
    });
});

app.listen(8080,function() {
    console.log(__dirname)
    console.log(__dirname.slice(0,36))
    console.log(__dirname.slice(0,36) + 'templates');
    console.log('example app listneing on port 8080!');

});



// // retrieve module
// var MongoClient = require('mongodb').MongoClient;
//
// // connect to the db
// MongoClient.connect("mongodb://localhost", function(err, client) {
//     if(err) throw err;
//     var db = client.db('TEST_DB');
//     var collection = db.collection('data1');
//
//
//     var cocultureDict = {};
//     // grab everything from a collection, we can't assume we know culture
//     collection.find().toArray(function(err, result){
//         if (err) throw err;
//
//         // store generation for each new culture
//         for(var i in result) {
//             if(cocultureDict.hasOwnProperty(result[i].culture)) {
//                 cocultureDict[result[i].culture].push(result[i].generation)
//             }
//             else {
//                 cocultureDict[result[i].culture] = [result[i].generation]
//             }
//         }
//
//         // sort the generation for each culture
//         for(var i in cocultureDict) {
//             cocultureDict[i].sort()
//         }
//
//         console.log(cocultureDict)
//     });
//
//     client.close()
// });