var async = require('../../node_modules/async/dist/async');

//This is just a script, and not a part of the server.

async.waterfall([
    function (callback) {
        const fs = require('fs');
        var parse = require('../parse');
        var dataFolder = "../resources/feb_23";
        var cocultures = [];
        var monocultures = [];

        fs.readdirSync(dataFolder).forEach(function (subFolder) {


            if (subFolder === 'cocultures') {
                var sub_Folder_Name = dataFolder + "/" + subFolder;

                fs.readdirSync(sub_Folder_Name).forEach(function (sub_sub_Folder) {
                    var file = sub_Folder_Name + "/" + sub_sub_Folder;
                    cocultures.push(parse.readFile(file));
                });
            }
            if (subFolder === 'monocultures') {
                var sub_Folder_Name = dataFolder + "/" + subFolder;

                fs.readdirSync(sub_Folder_Name).forEach(function (sub_sub_Folder) {
                    var file = sub_Folder_Name + "/" + sub_sub_Folder;
                    monocultures.push(parse.readFile(file));
                });
            }

        });

        var all = cocultures.concat(monocultures);
        callback(null, all);
    }

], function (err, result) {
    console.log(result.length);
    var db = require('../db');
    db.insertDocs("FEB_23_CULTURES", result);
});



