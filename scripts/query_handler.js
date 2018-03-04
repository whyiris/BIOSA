function serviceQuery(queryObject, callback) {
    var dbParam = {
        db: null,
        collections: false, // asking for all collections
        collection: null,
        cultureType: null,
        culture: null
    };
    if(queryObject.hasOwnProperty("db")){           // which DB to query
        dbParam.db = queryObject.db;
    }

    if(queryObject.hasOwnProperty("collections")) {  // get all collections
        dbParam.collections = true;
        callback(null, dbParam);
    }
    else {
        if (queryObject.hasOwnProperty("collection")) {    // query specified Table (collection from differnet dates)
            dbParam.collection = queryObject.collection;
        }
        if (queryObject.hasOwnProperty("cultureType")) {   // query a specific culture type, either ccList or mcList
            dbParam.cultureType = queryObject.cultureType;
        }
        if (queryObject.hasOwnProperty("culture")) {
            dbParam.culture = queryObject.culture;
        }
        callback(null, dbParam);
    }
}

module.exports = {
    serviceQuery: serviceQuery
};
