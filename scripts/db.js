var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"; //Change the port for deployment.
var dbName = "BIOSA";


//TODO add document about parameters

// --------------------------- inserting same thing twice, will cause duplicates
// insert one doc
function insertOneDoc(table, document, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback(err, null)
        } else {
            var ourDB = db.db(dbName);
            ourDB.collection(table).insertOne(document, function (err, res) {
                try {
                    if (err) callback(err, res);
                }
                finally {
                    db.close();
                }
            });
        }
    });
}

// insert a list of docs
function insertDocs(table, document, callback) {
    MongoClient.connect(url, function (err, db) {
        if(err){
            callback(err, null)
        }else {
            var ourDB = db.db(dbName);
            for (var i = 0; i < document.length; i++) {
                ourDB.collection(table).insertOne(document[i], function (err, res) {
                    try {
                        if (err) callback(err, res);
                    }
                    finally {
                        db.close();
                    }
                });
            }
        }
    });
}


/**
 * this function rename the name of an existed collection in the database
 * @param {string} origName - original name of a collection
 * @param {string} newName - new name to be used for a collection
 */
function renameCollection(origName, newName, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err){
            callback(err, null);
        }else {
            var dbo = db.db(dbName);
            dbo.collection(origName).rename(newName, function (err, res) {
                try{
                    if (err) callback(err, res);
                }
                finally{
                    db.close();
                }
            });
        }
    });
}


// ===================== query functions ===========================
/**
 * this function returns a list of collection names in the database in sorted order
 */
function queryTables(callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback(err, db);
        } else {
            var dbo = db.db(dbName);
            dbo.listCollections().toArray(function (err, result) {
                try{
                    if (err) {
                        callback(err, result)
                    } else {
                        var tableArr = [];
                        for (var i = 0; i < result.length; i++) {
                            tableArr.push(result[i].name);
                        }
                        callback(err, tableArr.sort());
                    }
                }
                finally{
                    db.close();
                }
            });
        }
    });
}


/**
 * this function returns a list of generations (integers) in sorted order
 * @param {string} table - database collection
 * @param {string} culture - culture name (e.g. HA3)
 */
function queryGenerations(table, culture, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback(err, db);
        } else {
            var dbo = db.db(dbName);
            var query = {culture: culture};
            dbo.collection(table).find(query).toArray(function (err, result) {
                try {
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
                }
                finally {
                    db.close();
                }
            });
        }
    });
}


/**
 * this function returns all the cultures(e.g. HA3) in a culture type(either coculture or monoculture) in sorted order
 * @param {string} table - database collection
 * @param {string} type - culture type (either coculture or monoculture)
 */
function queryCultures(table, type, callback) {
    MongoClient.connect(url, function (err, db) {
        if(err){
            callback(err, null);
        }else{
            var dbo = db.db(dbName);
            var query = {type: type};
            dbo.collection(table).find(query).toArray(function (err, result) {
                try {
                    if (err) {
                        callback(err, result);
                    } else {
                        // console.log(result);
                        var cultArr = [];
                        for (var i = 0; i < result.length; i++) {
                            var culture = result[i].culture;
                            cultArr.push(culture);
                        }
                        var uniqueArr = cultArr.filter(findUnique);
                        callback(err, uniqueArr.sort());
                    }
                }
                finally {
                    db.close();
                }
            });
        }
    });
}


/**
 * This function returns a list of all mutation objects (SNP, SUB, DEL, INS, MOB, AMP, CON, INV)
 * and all evidence objects (RA, JC, MC, UN)
 * @param {string} table - database collection
 * @param {string} culture - culture name (e.g. HA3)
 * @param {string} generation - generation (e.g. 100)
 */
function queryMutEvid(table, culture, generation, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback(err, db);
        } else {
            var dbo = db.db(dbName);
            var query = {culture: culture, generation: generation};
            dbo.collection(table).find(query).toArray(function (err, result) {
                try {
                    if (err) {
                        callback(err, result);
                    } else {
                        callback(err, result[0]);
                    }
                }
                finally {
                    db.close();
                }
            });
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
    queryMutEvid: queryMutEvid,
    queryTables: queryTables,
    renameCollection: renameCollection
};





