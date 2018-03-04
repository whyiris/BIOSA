var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"; //Change the port for deployment.


//TODO update insert docs
//TODO add document about parameters
//TODO handle different database name other than BIOSA
//TODO implement finally clause for closing database
//TODO if an error exists return the error and NOT throw

// --------------------------- inserting same thing twice, will cause duplicates
// insert one doc
function insertOneDoc(table, document) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var ourDB = db.db("BIOSA");
        ourDB.collection(table).insertOne(document, function (err, res) {
            if (err) throw err;
            // console.log("1 document inserted");
            db.close();
        });
    });
}

// insert a list of docs
function insertDocs(table, document) {
    for (var i = 0; i < document.length; i++) {
        // console.log(i);
        insertOneDoc(table, document[i]);
    }
}

// ===================== rename collection ===========================
function renameCollection(origName, newName) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("BIOSA");
        dbo.collection(origName).rename(newName, function (err, res) {
            if (err) throw err;
            // console.log("Collection has been renamed!");
            db.close();
        })
    });
}


// ===================== query functions ===========================
// queryTables returns a list of table names in sorted order
function queryTables(callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("BIOSA");
        dbo.listCollections().toArray(function (err, result) {
            if (err) throw err;
            var tableArr = [];
            for (var i = 0; i < result.length; i++) {
                tableArr.push(result[i].name);
            }
            db.close();
            callback(err, tableArr.sort());
        });
    });
}

// queryGenerations returns a list of generations in sorted order (int)
function queryGenerations(table, culture, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("BIOSA");
        var query = {culture: culture};
        dbo.collection(table).find(query).toArray(function (err, result) {
            if (err) throw err;
            var genArr = [];
            for (var i = 0; i < result.length; i++) {
                var int = parseInt(result[i].generation);
                genArr.push(int);
            }
            db.close();
            callback(err, genArr.sort(sortNumber));
        });
    });
}

// queryCultures returns a list of cultures that are unique in sorted order (string)
function queryCultures(table, type, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("BIOSA");
        var query = {type: type};
        dbo.collection(table).find(query).toArray(function (err, result) {
            if (err) throw err;
            var cultArr = [];
            for (var i = 0; i < result.length; i++) {
                var culture = result[i].culture;
                cultArr.push(culture);
            }
            var uniqueArr = cultArr.filter(findUnique);
            db.close();
            callback(err, uniqueArr.sort());
        });
    });
}

// queryMutations returns a list of mutation objects
function queryMutations(table, culture, mutationType, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("BIOSA");
        var query = {culture: culture};
        dbo.collection(table).find(query).toArray(function (err, result) {
            if (err) throw err;
            var resultArr = [];
            for (var i = 0; i < result.length; i++) {
                var mutationArr = result[i].mutations;
                for (var j = 0; j < mutationArr.length; j++) {
                    if (mutationArr[j].type === mutationType) {
                        resultArr.push(mutationArr[j]);
                    }
                }
            }
            // console.log(resultArr);
            db.close();
            callback(err, resultArr);
        });
    });
}

// queryEvidences returns a list of evidence objects
function queryEvidences(table, culture, evidenceType, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("BIOSA");
        var query = {culture: culture};
        dbo.collection(table).find(query).toArray(function (err, result) {
            if (err) throw err;
            var resultArr = [];
            for (var i = 0; i < result.length; i++) {
                var evidenceArr = result[i].evidences;
                for (var j = 0; j < evidenceArr.length; j++) {
                    if (evidenceArr[j].type === evidenceType) {
                        resultArr.push(evidenceArr[j]);
                    }
                }
            }
            // console.log(resultArr);
            db.close();
            callback(err, resultArr);
        });
    });
}

function sortNumber(a, b) {
    return a - b;
}

function findUnique(value, index, self) {
    return self.indexOf(value) === index;
}


module.exports = {

    insertOneDoc: insertOneDoc,
    insertDocs: insertDocs,
    queryGenerations: queryGenerations,
    queryCultures: queryCultures,
    queryMutations: queryMutations,
    queryEvidences: queryEvidences,
    renameCollection: renameCollection,
    queryTables: queryTables
}