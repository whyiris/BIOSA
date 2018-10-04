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
        } else {
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

function queryUniqueGenerations(table, culture, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback(err, db);
        } else {
            var dbo = db.db(dbName);
            dbo.collection(table).aggregate([
                { "$match": { "culture": culture }},
                { "$group": { _id: "$generation" }},
                { "$sort": { _id: 1 }}
            ]).toArray(function(err, result) {
                try {
                    if (err) {
                        callback(err, result);
                    } else {
                        var genArr = [];
                        for (var i = 0; i < result.length; i++) {
                            var int = parseInt(result[i]._id);
                            genArr.push(int);
                        }
                        callback(err, genArr);
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


function queryUniqueCulture(table, type, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback(err, db);
        } else {
            var dbo = db.db(dbName);
            dbo.collection(table).aggregate([
                { "$match": { "type": type }},
                { "$group": { _id: "$culture" }},
                { "$sort": { _id: 1 }}
            ]).toArray(function(err, result) {
                try {
                    if (err) {
                        callback(err, result);
                    } else {
                        var cultArr = [];
                        for (var i = 0; i < result.length; i++) {
                            var culture = result[i]._id;
                            cultArr.push(culture);
                        }
                        callback(err, cultArr);
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
            console.log(" in quert MutEvid!!!!!!!!!!!!")
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


/**
 * This function returns
 */
function queryCompare(table, culture, generation, callback) {
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        var dbo = db.db("BIOSA");
        dbo.collection(table).aggregate([
            { "$match": { "$or": [{"culture": culture}, {"culture": "Ancestor"}] } },
            { "$unwind": "$mutations"},
            { "$project": {
                    culture: "$culture",
                    generation: "$generation",
                    mutation: "$mutations",
                    evidence: { $filter: {
                            input: "$evidences",
                            as: "evidence",
                            cond: { $eq: ["$$evidence.evidence_id", "$mutations.parent_ids"] }
                        }}
                }},
            { "$group": {
                    // position
                    _id: "$mutation.position",

                    // type
                    type: {$addToSet: "$mutation.type"},

                    // frequency
                    frequency: { $addToSet: { "generation": "$generation",
                            "freq": "$mutation.frequency"
                        }},

                    // seq_id
                    seq_id: { $addToSet: "$mutation.seq_id" },

                    // description
                    description: { $addToSet: "$mutation.gene_product" },

                    // gene
                    gene: { $addToSet: { "gene_name": "$mutation.gene_name",
                            "gene_strand": "$mutation.gene_strand"
                        }},

                    // annotation
                    annotation: { $addToSet: { "gene_position": "$mutation.gene_position",
                            "aa_ref_seq": "$mutation.aa_ref_seq",
                            "aa_position": "$mutation.aa_position",
                            "aa_new_seq": "$mutation.aa_new_seq",
                            "codon_ref_seq": "$mutation.codon_ref_seq",
                            "codon_new_seq": "$mutation.codon_new_seq"
                        }},

                    // mutation
                    mutation: {$addToSet: { "new_seq": "$mutation.new_seq",
                            "size": "$mutation.size",
                            "ref_base": "$evidence.ref_base",
                            "new_base": "$evidence.new_base",
                            "repeat_name": "$mutation.repeat_name",
                            "duplication_size": "$mutation.duplication_size"
                        }}
                }},
            { "$sort": { seq_id: 1, _id: 1 }}
        ]).toArray(function(err, result) {
            try {
                if (err) {
                    callback(err, result);
                } else {
                    callback(err, result);
                }
            }
            finally {
                db.close();
            }
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

    // newly added function to faster query generation and cultures
    queryUniqueGenerations: queryUniqueGenerations,
    queryUniqueCulture: queryUniqueCulture,

    queryMutEvid: queryMutEvid,
    queryCompare: queryCompare,

    queryTables: queryTables,
    renameCollection: renameCollection
};





