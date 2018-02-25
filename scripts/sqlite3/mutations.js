var sqlite3 = require('sqlite3');  // need to do npm sqlite3

var dbState = {isConnected: false};  // pass by reference

function connect() {
    dbState.db = new sqlite3.Database('../resources/coevolution.DB', function(err) {
        if(err){
            console.error(err.message);
        }
        console.log('Connected to the database');
        dbState.isConnected = true;
    });
}

function insert(entity) {
    if(!dbState.isConnected) {
        console.error("Not connected to the database");
        return;
    }
    var placeholders = entity.map(function (item) {
        return '(?)';
    }).join(',');

    var sql = 'INSERT INTO MUTATIONS VALUES ' + placeholders;
    console.log(sql)
    dbState.run(sql, entity, function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log('Rows inserted ' + this.changes);
    });
}

module.exports = {
    connect: connect,
    insert: insert
};


