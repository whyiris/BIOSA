var MongoClient = require('mongodb').MongoClient;
var URL = "mongodb://localhost:27017/"
var DB = "BIOSA";
var COLLECTION = "FEB_23_CULTURES";  // table






//queryCult(COLLECTION, "B", 10);
queryCults(COLLECTION, ["HA3", "HE3"], [100, 300], function(ret){
    console.log("finished: ", ret.length);
    console.log("it came in late", ret.length);
});

