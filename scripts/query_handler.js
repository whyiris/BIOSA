function serviceQuery(queryObject, callback) {
    var dbParam = {
        db: null,
        collections: false, // asking for all collections
        collection: null,
        cultureType: null,
        culture: null,
        generation: null,
        mutations: false,
        evidences: false
    };
    if(queryObject.hasOwnProperty("db")){           // which DB to query
        dbParam.db = queryObject.db;
    }

    if(queryObject.hasOwnProperty("collections")) {  // get all collections
        dbParam.collections = true;
        callback(null, dbParam);
    }
    else {
        if (queryObject.hasOwnProperty("collection")) {    // query specified Table (collection from different dates)
            dbParam.collection = queryObject.collection;
        }
        if (queryObject.hasOwnProperty("cultureType")) {   // query a specific culture type, either ccList or mcList
            dbParam.cultureType = queryObject.cultureType;
        }
        if (queryObject.hasOwnProperty("culture")) {
            dbParam.culture = queryObject.culture;
        }
        if (queryObject.hasOwnProperty("generation")) {
            dbParam.generation = queryObject.generation;
        }
        if (queryObject.hasOwnProperty("mutations")) {
            dbParam.mutations = queryObject.mutations;
        }
        if (queryObject.hasOwnProperty("evidences")) {
            dbParam.evidences = queryObject.evidences;
        }
        callback(null, dbParam);
    }
}

module.exports = {
    serviceQuery: serviceQuery
};
