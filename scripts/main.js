const fs = require('fs');
// var db = require('db');
var helloObj = require('./parse');
var dataFolder = "../resources/feb_23";
extractData(dataFolder);

function extractData(dataFolder) {

    var cocultures = [];
    var monocultures = [];

    fs.readdirSync(dataFolder).forEach(function (subFolder) {



        if (subFolder == 'cocultures') {
            var sub_Folder_Name = dataFolder + "/" + subFolder;

            fs.readdirSync(sub_Folder_Name).forEach(function (sub_sub_Folder) {
                var file = sub_Folder_Name + "/" + sub_sub_Folder;
                cocultures.push(helloObj.readFile(file));
            });
        }
        if (subFolder == 'monocultures') {
            var sub_Folder_Name = dataFolder + "/" + subFolder;

            fs.readdirSync(sub_Folder_Name).forEach(function (sub_sub_Folder) {
                var file = sub_Folder_Name + "/" + sub_sub_Folder;
                monocultures.push(helloObj.readFile(file));
            });
        }


    });


    // console.log(';;;;;;;;;;;;;;;')
// console.log("cocultures:::::::::" + cocultures);
// console.log("finish!!!!!!!! " + cocultures.length);
// console.log("finish!!!!!!!! " + monocultures.length);
//
//     console.log(cocultures[0].mutations);
    return cocultures, monocultures;
}

// db.connect();
//
//
// db.createCollection('Feb_23_CULTURE')
// db.insertDB('Feb_23_CULTURE', cocultures)
// db.insertDB('Feb_23_CULTURE', monocultures)













