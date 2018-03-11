var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"; //Change the port for deployment.
var dbName = "BIOSA";


//TODO add document about parameters

// --------------------------- inserting same thing twice, will cause duplicates
// insert one doc
function insertOneDoc(table, document, callback) {
    MongoClient.connect(url, function (err, db) {
        try {
            if (err) {
                callback(err, db);
            } else {
                var ourDB = db.db(dbName);
                ourDB.collection(table).insertOne(document, function (err, res) {
                    if (err) callback(err, res);
                });
            }
        }
        finally {
            db.close();
        }
    });
}

// insert a list of docs
function insertDocs(table, document, callback) {
    MongoClient.connect(url, function (err, db) {
        try {
            if (err) {
                callback(err, db);
            } else {
                var ourDB = db.db(dbName);
                for (var i = 0; i < document.length; i++) {
                    ourDB.collection(table).insertOne(document[i], function (err, res) {
                        if (err) callback(err, res);
                    });
                }
            }
        }
        finally {
            db.close();
        }
    });
}

// ===================== rename collection ===========================
function renameCollection(origName, newName, callback) {
    MongoClient.connect(url, function (err, db) {
        try {
            if (err) {
                callback(err, db);
            } else {
                var dbo = db.db(dbName);
                dbo.collection(origName).rename(newName, function (err, res) {
                    if (err) callback(err, res);
                });
            }
        }
        finally {
            db.close();
        }
    });
}


// ===================== query functions ===========================
// queryTables returns a list of table names in sorted order
function queryTables(callback) {
    MongoClient.connect(url, function (err, db) {
        try {
            if (err) {
                callback(err, db);
            } else {
                var dbo = db.db(dbName);
                dbo.listCollections().toArray(function (err, result) {
                    if (err) {
                        callback(err, result)
                    } else {
                        var tableArr = [];
                        for (var i = 0; i < result.length; i++) {
                            tableArr.push(result[i].name);
                        }
                        callback(err, tableArr.sort());
                    }
                });
            }
        }
        finally {
            db.close();
        }
    });
}

// queryGenerations returns a list of generations in sorted order (int)
function queryGenerations(table, culture, callback) {
    MongoClient.connect(url, function (err, db) {
        try {
            if (err) {
                callback(err, db);
            } else {
                var dbo = db.db(dbName);
                var query = {culture: culture};
                dbo.collection(table).find(query).toArray(function (err, result) {
                    if (err) {
                        callback(err, result);
                    } else {
                        var genArr = [];
                        for (var i = 0; i < result.length; i++) {
                            var int = parseInt(result[i].generation);
                            genArr.push(int);
                        }
                        callback(err, genArr.sort(sortNumber));
                    }
                });
            }
        }
        finally {
            db.close();
        }
    });
}

// queryCultures returns a list of cultures that are unique in sorted order (string)
function queryCultures(table, type, callback) {
    MongoClient.connect(url, function (err, db) {
        var dbo = db.db(dbName);
        var query = {type: type};
        console.log(dbName);
        console.log(table);
        console.log(query);
        dbo.collection(table).find(query).toArray(function (err, result) {
            try {
                if (err) {
                    console.log(err);
                    callback(err, result);
                } else {
                    console.log(result);
                    var cultArr = [];
                    for (var i = 0; i < result.length; i++) {
                        var culture = result[i].culture;
                        cultArr.push(culture);
                    }
                    var uniqueArr = cultArr.filter(findUnique);
                    callback(err, uniqueArr.sort());
                }
            } finally{
                db.close();
            }
        });

    });
}

// queryCultures returns a list of cultures that are unique in sorted order (string)
// function queryCultures(table, type, callback) {
//     MongoClient.connect(url, function (err, db) {
//         if (err) throw err;
//         var dbo = db.db("BIOSA");
//         var query = {type: type};
//         dbo.collection(table).find(query).toArray(function (err, result) {
//             if (err) throw err;
//             var cultArr = [];
//             for (var i = 0; i < result.length; i++) {
//                 var culture = result[i].culture;
//                 cultArr.push(culture);
//             }
//             var uniqueArr = cultArr.filter(findUnique);
//             db.close();
//             callback(err, uniqueArr.sort());
//         });
//     });
// }

// queryMutations returns a list of mutation objects
function queryMutations(table, culture, mutationType, callback) {
    MongoClient.connect(url, function (err, db) {
        try {
            if (err) {
                callback(err, db);
            } else {
                var dbo = db.db(dbName);
                var query = {culture: culture};
                dbo.collection(table).find(query).toArray(function (err, result) {
                    if (err) {
                        callback(err, result);
                    } else {
                        var resultArr = [];
                        for (var i = 0; i < result.length; i++) {
                            var mutationArr = result[i].mutations;
                            for (var j = 0; j < mutationArr.length; j++) {
                                if (mutationArr[j].type === mutationType) {
                                    resultArr.push(mutationArr[j]);
                                }
                            }
                        }
                        callback(err, resultArr);
                    }
                });
            }
        }
        finally {
            db.close();
        }
    });
}

// queryEvidences returns a list of evidence objects
function queryEvidences(table, culture, evidenceType, callback) {
    MongoClient.connect(url, function (err, db) {
        try {
            if (err) {
                callback(err, db);
            } else {
                var dbo = db.db(dbName);
                var query = {culture: culture};
                dbo.collection(table).find(query).toArray(function (err, result) {
                    if (err) {
                        callback(err, result);
                    } else {
                        var resultArr = [];
                        for (var i = 0; i < result.length; i++) {
                            var evidenceArr = result[i].evidences;
                            for (var j = 0; j < evidenceArr.length; j++) {
                                if (evidenceArr[j].type === evidenceType) {
                                    resultArr.push(evidenceArr[j]);
                                }
                            }
                        }
                        callback(err, resultArr);
                    }
                });
            }
        }
        finally {
            db.close();
        }
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

