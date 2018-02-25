var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";



// --------------------------- inserting same thing twice, will cause duplicates
// insert one doc
function insertOneDoc(table, document)
{
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var ourDB = db.db("ourDB");
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
        insertOneDoc(table, document[i]);
    }
}


function queryOneCult(table, culture, generation){

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ourDB");
        var query = {culture:culture, generation:generation};
        console.log(query);
        dbo.collection(table).find(query).toArray(function(err, result) {
            if (err) throw err;
            db.close();
            console.log(result);
            // return result;
        });
    });
}


function queryDB(table){

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ourDB");
        dbo.collection(table).find({}).toArray(function(err, result) {
            if (err) throw err;
            db.close();
            console.log(result);
            // return result;
        });
    });
}

// function queryCults(table, cultures, generations) {
//     var async = require('async');
//     async.waterfall([
//         function(callback){
//             var resultArr = [];
//             MongoClient.connect(url, function (err, db) {
//                 if (err) throw err;
//                 var dbo = db.db("ourDB");
//                 for (var i = 0; i < cultures.length; i++) {
//                     for (var j = 0; j < generations.length; j++) {
//                         var query = {culture: cultures[i], generation: generations[j]};
//                         // console.log(query);
//                         callback(null, dbo.collection(table).find(query))
//                     }
//                 }
//                 db.close();
//             });
//         }
//     ], function (err, result) {
//         console.log(result);
//     })
//
// }


// culture and generation are arrays
function queryCults(table, cultures, generations) {
    var resultArr = [];
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("ourDB");
        for (var i = 0; i < cultures.length; i++) {
            for (var j = 0; j < generations.length; j++) {
                var query = {culture: cultures[i], generation: generations[j]};
                // console.log(query);
                dbo.collection(table).find(query).toArray(function (err, result) {
                    if (err) throw err;
                    // console.log(result);
                    // resultArr.push(JSON.parse(JSON.stringify(result)));
                    resultArr.push(result);
                    // console.log("resultArr");
                    // console.log(resultArr);

                });
            }
        }
        console.log(resultArr);
        db.close();
    });
}


// ---------------------------- below codes are for testing
var table = "CULTURES";
var data1 = { culture: 'B',
    generation: 10,
    mutations:
        [ { type: 'SUB',
            evidence_id: '1',
            parent_ids: '13653',
            seq_id: 'NC_005791',
            position: '18978',
            size: '84',
            new_seq: 'TCT',
            frequency: '1.04643704e-01',
            gene_list: 'DP1',
            gene_name: 'DP1',
            gene_position: 'coding (299-382/1758 nt)',
            gene_product: 'DNA polymerase II small subunit',
            gene_strand: '<',
            html_gene_name: '<i>DP1</i>&nbsp;&larr;',
            locus_tag: 'MMP0008' },
            { type: 'SNP',
                evidence_id: '2',
                parent_ids: '110',
                seq_id: 'NC_005791',
                position: '19066',
                new_seq: 'T',
                aa_new_seq: 'K',
                aa_position: '98',
                aa_ref_seq: 'N',
                codon_new_seq: 'AAA',
                codon_number: '98',
                codon_position: '3',
                codon_ref_seq: 'AAT',
                frequency: '5.73153496e-02',
                gene_list: 'DP1',
                gene_name: 'DP1',
                gene_position: '294',
                gene_product: 'DNA polymerase II small subunit',
                gene_strand: '<',
                html_gene_name: '<i>DP1</i>&nbsp;&larr;',
                locus_tag: 'MMP0008',
                snp_type: 'nonsynonymous',
                transl_table: '11' }]};

var data2 = { culture: 'B',
    generation: 100,
    mutations:
        [ { type: 'SUB',
            evidence_id: '1',
            parent_ids: '13653',
            seq_id: 'NC_005791',
            position: '18978',
            size: '84',
            new_seq: 'TCT',
            frequency: '1.04643704e-01',
            gene_list: 'DP1',
            gene_name: 'DP1',
            gene_position: 'coding (299-382/1758 nt)',
            gene_product: 'DNA polymerase II small subunit',
            gene_strand: '<',
            html_gene_name: '<i>DP1</i>&nbsp;&larr;',
            locus_tag: 'MMP0008' },
            { type: 'SNP',
                evidence_id: '2',
                parent_ids: '110',
                seq_id: 'NC_005791',
                position: '19066',
                new_seq: 'T',
                aa_new_seq: 'K',
                aa_position: '98',
                aa_ref_seq: 'N',
                codon_new_seq: 'AAA',
                codon_number: '98',
                codon_position: '3',
                codon_ref_seq: 'AAT',
                frequency: '5.73153496e-02',
                gene_list: 'DP1',
                gene_name: 'DP1',
                gene_position: '294',
                gene_product: 'DNA polymerase II small subunit',
                gene_strand: '<',
                html_gene_name: '<i>DP1</i>&nbsp;&larr;',
                locus_tag: 'MMP0008',
                snp_type: 'nonsynonymous',
                transl_table: '11' }]} ;

var data3 = { culture: 'C',
    generation: 10,
    mutations:
        [ { type: 'SUB',
            evidence_id: '1',
            parent_ids: '13653',
            seq_id: 'NC_005791',
            position: '18978',
            size: '84',
            new_seq: 'TCT',
            frequency: '1.04643704e-01',
            gene_list: 'DP1',
            gene_name: 'DP1',
            gene_position: 'coding (299-382/1758 nt)',
            gene_product: 'DNA polymerase II small subunit',
            gene_strand: '<',
            html_gene_name: '<i>DP1</i>&nbsp;&larr;',
            locus_tag: 'MMP0008' },
            { type: 'SNP',
                evidence_id: '2',
                parent_ids: '110',
                seq_id: 'NC_005791',
                position: '19066',
                new_seq: 'T',
                aa_new_seq: 'K',
                aa_position: '98',
                aa_ref_seq: 'N',
                codon_new_seq: 'AAA',
                codon_number: '98',
                codon_position: '3',
                codon_ref_seq: 'AAT',
                frequency: '5.73153496e-02',
                gene_list: 'DP1',
                gene_name: 'DP1',
                gene_position: '294',
                gene_product: 'DNA polymerase II small subunit',
                gene_strand: '<',
                html_gene_name: '<i>DP1</i>&nbsp;&larr;',
                locus_tag: 'MMP0008',
                snp_type: 'nonsynonymous',
                transl_table: '11' }]};

var data4 = { culture: 'C',
    generation: 100,
    mutations:
        [ { type: 'SUB',
            evidence_id: '1',
            parent_ids: '13653',
            seq_id: 'NC_005791',
            position: '18978',
            size: '84',
            new_seq: 'TCT',
            frequency: '1.04643704e-01',
            gene_list: 'DP1',
            gene_name: 'DP1',
            gene_position: 'coding (299-382/1758 nt)',
            gene_product: 'DNA polymerase II small subunit',
            gene_strand: '<',
            html_gene_name: '<i>DP1</i>&nbsp;&larr;',
            locus_tag: 'MMP0008' },
            { type: 'SNP',
                evidence_id: '2',
                parent_ids: '110',
                seq_id: 'NC_005791',
                position: '19066',
                new_seq: 'T',
                aa_new_seq: 'K',
                aa_position: '98',
                aa_ref_seq: 'N',
                codon_new_seq: 'AAA',
                codon_number: '98',
                codon_position: '3',
                codon_ref_seq: 'AAT',
                frequency: '5.73153496e-02',
                gene_list: 'DP1',
                gene_name: 'DP1',
                gene_position: '294',
                gene_product: 'DNA polymerase II small subunit',
                gene_strand: '<',
                html_gene_name: '<i>DP1</i>&nbsp;&larr;',
                locus_tag: 'MMP0008',
                snp_type: 'nonsynonymous',
                transl_table: '11' }]};


var multiDocs = [data1, data2, data3, data4];
// insertOneDoc(table, data[0]);
// insertDocs(table, multiDocs);

// queryOneCult(table, "B", 10);
queryCults(table, ["B","C"], [10, 100]);
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


module.exports = {

    insertOneDoc: insertOneDoc,
    insertDocs: insertDocs,
    queryDB: queryDB,
    queryCults: queryCults,
    queryOneCult: queryOneCult
}