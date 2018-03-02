var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";



// --------------------------- inserting same thing twice, will cause duplicates
// insert one doc
function insertOneDoc(table, document)
{
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var ourDB = db.db("BIOSA");
        ourDB.collection(table).insertOne(document, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
}

// insert a list of docs
function insertDocs(table, document)
{
    for(var i = 0; i < document.length; i++)
    {
        console.log(i);
        insertOneDoc(table, document[i]);
    }
}

// ===================== rename collection ===========================
function renameCollection(origName, newName){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("BIOSA");
        dbo.collection(origName).rename(newName, function(err, res){
            if (err) throw err;
            console.log("Collection has been renamed!");
            db.close();
        })
    });
}

// ===================== query functions ===========================
// queryTables returns a list of table names in sorted order
function queryTables(callback){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("BIOSA");
        // var query = {culture:culture};
        dbo.listCollections().toArray(function(err, result) {
            if (err) throw err;
            var tableArr = [];
            for(var i = 0; i < result.length; i++){
                tableArr.push(result[i].name);
            }
            db.close();
            callback(err, tableArr.sort());
        });
    });
}

// queryGenerations returns a list of generations in sorted order (int)
function queryGenerations(table, culture, callback){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("BIOSA");
        var query = {culture:culture};
        dbo.collection(table).find(query).toArray(function(err, result) {
            if (err) throw err;
            var genArr = [];
            for(var i = 0; i < result.length; i++){
                var int = parseInt(result[i].generation);
                genArr.push(int);
            }
            db.close();
            callback(err, genArr.sort(sortNumber));
        });
    });
}

// queryCultures returns a list of cultures that are unique in sorted order (string)
function queryCultures(table, type, callback){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("BIOSA");
        var query = {type: type};
        dbo.collection(table).find(query).toArray(function(err, result) {
            if (err) throw err;
            var cultArr = [];
            for(var i = 0; i < result.length; i++){
                var culture = result[i].culture;
                cultArr.push(culture);
                // if(!(result.indexOf(culture) > -1))
                // {
                //     cultArr.push(culture);
                // }
            }
            var uniqueArr = cultArr.filter(findUnique);
            db.close();
            callback(err, uniqueArr.sort());
        });
    });
}

// queryMutations returns a list of mutation objects
function queryMutations(table, culture, mutationType, callback){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("BIOSA");
        var query = {culture:culture};
        dbo.collection(table).find(query).toArray(function(err, result) {
            if (err) throw err;
            var resultArr = [];
            for (var i = 0; i < result.length; i++){
                var mutationArr = result[i].mutations;
                for (var j = 0; j < mutationArr.length; j++){
                    if(mutationArr[j].type == mutationType){
                        resultArr.push(mutationArr[j]);
                    }
                }
            }
            console.log(resultArr);
            db.close();
            callback(err, resultArr);
        });
    });
}

// queryEvidences returns a list of evidence objects
function queryEvidences(table, culture, evidenceType, callback){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("BIOSA");
        var query = {culture:culture};
        dbo.collection(table).find(query).toArray(function(err, result) {
            if (err) throw err;
            var resultArr = [];
            for (var i = 0; i < result.length; i++){
                var evidenceArr = result[i].evidences;
                for (var j = 0; j < evidenceArr.length; j++){
                    if(evidenceArr[j].type == evidenceType){
                        resultArr.push(evidenceArr[j]);
                    }
                }
            }
            console.log(resultArr);
            db.close();
            callback(err, resultArr);
        });
    });
}

function sortNumber(a,b) {
    return a - b;
}

function findUnique(value, index, self) {
    return self.indexOf(value) === index;
}

// =================== Old functions ===========================
// culture and generation are arrays
// function queryCults(table, cultures, generations) {
//
//     MongoClient.connect(url, function (err, db) {
//         if (err) throw err;
//         var dbo = db.db("ourDB");
//         for (var i = 0; i < cultures.length; i++) {
//             for (var j = 0; j < generations.length; j++) {
//                 var query = {culture: cultures[i], generation: generations[j]};
//                 // console.log(query);
//                 dbo.collection(table).find(query).toArray(function (err, result) {
//                     if (err) throw err;
//                     // console.log(result);
//                     // resultArr.push(JSON.parse(JSON.stringify(result)));
//                     // console.log("resultArr");
//                     // console.log(resultArr);
//
//                 });
//             }
//         }
//         //console.log(resultArr);
//         db.close();
//     });
// }

// function queryOneCult(table, culture, generation, callback){
//
//     MongoClient.connect(url, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db("BIOSA");
//         var query = {culture:culture, generation:generation};
//         // console.log(query);
//         dbo.collection(table).find(query).toArray(function(err, result) {
//             if (err) throw err;
//             db.close();
//             callback(null, result);
//             // return result;
//         });
//     });
// }

// function queryDB(table){
//
//     MongoClient.connect(url, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db("ourDB");
//         dbo.collection(table).find({}).toArray(function(err, result) {
//             if (err) throw err;
//             db.close();
//             console.log(result);
//             // return result;
//         });
//     });
// }


// ---------------------------- below codes are for testing
// var table = "CULTURES";
// var data1 = { culture: 'B',
//     generation: 10,
//     mutations:
//         [ { type: 'SUB',
//             evidence_id: '1',
//             parent_ids: '13653',
//             seq_id: 'NC_005791',
//             position: '18978',
//             size: '84',
//             new_seq: 'TCT',
//             frequency: '1.04643704e-01',
//             gene_list: 'DP1',
//             gene_name: 'DP1',
//             gene_position: 'coding (299-382/1758 nt)',
//             gene_product: 'DNA polymerase II small subunit',
//             gene_strand: '<',
//             html_gene_name: '<i>DP1</i>&nbsp;&larr;',
//             locus_tag: 'MMP0008' },
//             { type: 'SNP',
//                 evidence_id: '2',
//                 parent_ids: '110',
//                 seq_id: 'NC_005791',
//                 position: '19066',
//                 new_seq: 'T',
//                 aa_new_seq: 'K',
//                 aa_position: '98',
//                 aa_ref_seq: 'N',
//                 codon_new_seq: 'AAA',
//                 codon_number: '98',
//                 codon_position: '3',
//                 codon_ref_seq: 'AAT',
//                 frequency: '5.73153496e-02',
//                 gene_list: 'DP1',
//                 gene_name: 'DP1',
//                 gene_position: '294',
//                 gene_product: 'DNA polymerase II small subunit',
//                 gene_strand: '<',
//                 html_gene_name: '<i>DP1</i>&nbsp;&larr;',
//                 locus_tag: 'MMP0008',
//                 snp_type: 'nonsynonymous',
//                 transl_table: '11' }]};
//
// var data2 = { culture: 'B',
//     generation: 100,
//     mutations:
//         [ { type: 'SUB',
//             evidence_id: '1',
//             parent_ids: '13653',
//             seq_id: 'NC_005791',
//             position: '18978',
//             size: '84',
//             new_seq: 'TCT',
//             frequency: '1.04643704e-01',
//             gene_list: 'DP1',
//             gene_name: 'DP1',
//             gene_position: 'coding (299-382/1758 nt)',
//             gene_product: 'DNA polymerase II small subunit',
//             gene_strand: '<',
//             html_gene_name: '<i>DP1</i>&nbsp;&larr;',
//             locus_tag: 'MMP0008' },
//             { type: 'SNP',
//                 evidence_id: '2',
//                 parent_ids: '110',
//                 seq_id: 'NC_005791',
//                 position: '19066',
//                 new_seq: 'T',
//                 aa_new_seq: 'K',
//                 aa_position: '98',
//                 aa_ref_seq: 'N',
//                 codon_new_seq: 'AAA',
//                 codon_number: '98',
//                 codon_position: '3',
//                 codon_ref_seq: 'AAT',
//                 frequency: '5.73153496e-02',
//                 gene_list: 'DP1',
//                 gene_name: 'DP1',
//                 gene_position: '294',
//                 gene_product: 'DNA polymerase II small subunit',
//                 gene_strand: '<',
//                 html_gene_name: '<i>DP1</i>&nbsp;&larr;',
//                 locus_tag: 'MMP0008',
//                 snp_type: 'nonsynonymous',
//                 transl_table: '11' }]} ;
//
// var data3 = { culture: 'C',
//     generation: 10,
//     mutations:
//         [ { type: 'SUB',
//             evidence_id: '1',
//             parent_ids: '13653',
//             seq_id: 'NC_005791',
//             position: '18978',
//             size: '84',
//             new_seq: 'TCT',
//             frequency: '1.04643704e-01',
//             gene_list: 'DP1',
//             gene_name: 'DP1',
//             gene_position: 'coding (299-382/1758 nt)',
//             gene_product: 'DNA polymerase II small subunit',
//             gene_strand: '<',
//             html_gene_name: '<i>DP1</i>&nbsp;&larr;',
//             locus_tag: 'MMP0008' },
//             { type: 'SNP',
//                 evidence_id: '2',
//                 parent_ids: '110',
//                 seq_id: 'NC_005791',
//                 position: '19066',
//                 new_seq: 'T',
//                 aa_new_seq: 'K',
//                 aa_position: '98',
//                 aa_ref_seq: 'N',
//                 codon_new_seq: 'AAA',
//                 codon_number: '98',
//                 codon_position: '3',
//                 codon_ref_seq: 'AAT',
//                 frequency: '5.73153496e-02',
//                 gene_list: 'DP1',
//                 gene_name: 'DP1',
//                 gene_position: '294',
//                 gene_product: 'DNA polymerase II small subunit',
//                 gene_strand: '<',
//                 html_gene_name: '<i>DP1</i>&nbsp;&larr;',
//                 locus_tag: 'MMP0008',
//                 snp_type: 'nonsynonymous',
//                 transl_table: '11' }]};
//
// var data4 = { culture: 'C',
//     generation: 100,
//     mutations:
//         [ { type: 'SUB',
//             evidence_id: '1',
//             parent_ids: '13653',
//             seq_id: 'NC_005791',
//             position: '18978',
//             size: '84',
//             new_seq: 'TCT',
//             frequency: '1.04643704e-01',
//             gene_list: 'DP1',
//             gene_name: 'DP1',
//             gene_position: 'coding (299-382/1758 nt)',
//             gene_product: 'DNA polymerase II small subunit',
//             gene_strand: '<',
//             html_gene_name: '<i>DP1</i>&nbsp;&larr;',
//             locus_tag: 'MMP0008' },
//             { type: 'SNP',
//                 evidence_id: '2',
//                 parent_ids: '110',
//                 seq_id: 'NC_005791',
//                 position: '19066',
//                 new_seq: 'T',
//                 aa_new_seq: 'K',
//                 aa_position: '98',
//                 aa_ref_seq: 'N',
//                 codon_new_seq: 'AAA',
//                 codon_number: '98',
//                 codon_position: '3',
//                 codon_ref_seq: 'AAT',
//                 frequency: '5.73153496e-02',
//                 gene_list: 'DP1',
//                 gene_name: 'DP1',
//                 gene_position: '294',
//                 gene_product: 'DNA polymerase II small subunit',
//                 gene_strand: '<',
//                 html_gene_name: '<i>DP1</i>&nbsp;&larr;',
//                 locus_tag: 'MMP0008',
//                 snp_type: 'nonsynonymous',
//                 transl_table: '11' }]};
//
//
// var multiDocs = [data1, data2, data3, data4];
// insertOneDoc(table, data[0]);
// insertDocs(table, multiDocs);
// var temp = null;
// queryOneCult(table, "B", 10, function(err, final){
//     // if (err){
//     //     console.log(err);
//     // }else{
//         console.log("result!!!!!");
//         console.log(final);
//     // }
// });

// queryCults(table, ["B","C"], [10, 100], function(){
//     console.log(resultArr);
// });
// queryDB(table);
// ======= testing array.push() ===========
// var test = [];
// console.log(test);
// var arr = [{1:"hi", 11: "haha", 111: ["dada", "asdasd"]},{2:"shit"},{3:"cat"},{4:"dog"},{5:"damn"}];
// for (var i = 0; i < arr.length; i++){
//     test.push(arr[i]);
//     console.log(test);
//
// }
// console.log(test);

// console.log('Program Start');
//
// var async = require('async');
// async.waterfall([
//     function (callback) {
//         console.log('First Step --> ');
//         callback(null, '1', '2');
//     },
//     function (arg1, arg2, callback) {
//         console.log('Second Step --> ' + arg1 + ' ' + arg2);
//         callback(null, '3');
//     },
//     function (arg1, callback) {
//         console.log('Third Step --> ' + arg1);
//         callback(null, 'final result');
//     }
// ], function (err, result) {
//     console.log('Main Callback --> ' + result);
// });
//
// console.log('Program End');

module.exports = {

    // insertOneDoc: insertOneDoc,
    insertDocs: insertDocs,
    // queryDB: queryDB,
    // queryCults: queryCults,
    queryGenerations: queryGenerations,
    queryCultures: queryCultures,
    queryMutations: queryMutations,
    queryEvidences: queryEvidences,
    renameCollection: renameCollection,
    queryTables: queryTables
}