var sqlite3 = require('sqlite3');  // need to do npm sqlite3
var db = new sqlite3.Database('./coevolution.db', function(err) {
    if(err){
        console.error(err.message);
    }
    console.log('Connected to the coevolution database.');
});

db.serialize(function() {
    db.each("SELECT * FROM `YEE_TABLE`", function(err, row) {
        if(err) {
            console.error(err.message);
        }
        console.log(row);
    });
});