//http://barricklab.org/twiki/pub/Lab/ToolsBacterialGenomeResequencing/documentation/gd_format.html

//------------------------------------------------------------
// mutation
var SNP = {
    type: [],
    evidence_id: [],
    parent_ids: [],

    seq_id: [],
    position: [],
    new_seq: []
}


var SUB = {
    type: [],
    evidence_id: [],
    parent_ids: [],

    seq_id: [],
    position: [],
    size: [],
    new_seq: []
}

var DEL = {
    type: [],
    evidence_id: [],
    parent_ids: [],

    seq_id: [],
    position: [],
    size: [],
}

var INS = {
    type: [],
    evidence_id: [],
    parent_ids: [],

    seq_id: [],
    position: [],
    new_seq: [],
    insert_position: [],
}



function create_SNP(line) {
    var obj = {};
    obj['type'] = "SNP";

    obj['evidence_id'] = line[1];
    obj['parent_ids'] = line[2];
    obj['seq_id'] = line[3];
    obj['position'] = line[4];
    obj['new_seq'] = line[5];

    var count = 6;
    while (count < line.length) {
        var v = line[count].split("=");
        obj[v[0]] = v[1];
        count++;
    }
    return obj;
}



function create_SUB(line) {
    var obj = {};
    obj['type'] = "SUB";

    obj['evidence_id'] = line[1];
    obj['parent_ids'] = line[2];
    obj['seq_id'] = line[3];
    obj['position'] = line[4];
    obj['size'] = line[5];
    obj['new_seq'] = line[6];

    var count = 7;
    while (count < line.length) {
        var v = line[count].split("=");
        obj[v[0]] = v[1];
        count++;
    }
    return obj;
}


function create_DEL(line) {
    var obj = {};
    obj['type'] = "DEL";

    obj['evidence_id'] = line[1];
    obj['parent_ids'] = line[2];
    obj['seq_id'] = line[3];
    obj['position'] = line[4];
    obj['size'] = line[5];

    var count = 6;
    while (count < line.length) {
        var v = line[count].split("=");
        obj[v[0]] = v[1];
        count++;
    }
    return obj;
}


function create_INS(line) {
    var obj = {};
    obj['type'] = "INS";

    obj['evidence_id'] = line[1];
    obj['parent_ids'] = line[2];
    obj['seq_id'] = line[3];
    obj['position'] = line[4];
    obj['new_seq'] = line[5];
    obj['insert_position'] = line[6];


    var count = 7;
    while (count < line.length) {
        var v = line[count].split("=");
        obj[v[0]] = v[1];
        count++;
    }
    return obj;
}





//------------------------------------------------------------
// evidence

var RA = {
    type: [],
    evidence_id: [],
    parent_ids: [],

    seq_id: [],
    position: [],
    insert_position: [],
    ref_base: [],
    new_base: []
}



var MC = {
    type: [],
    evidence_id: [],
    parent_ids: [],

    seq_id: [],
    start: [],
    end: [],
    start_range: [],
    end_range: []
}



var JC = {
    type: [],
    evidence_id: [],
    parent_ids: [],

    side_1_seq_id: [],
    side_1_position: [],
    side_1_strand: [],
    side_2_seq_id: [],
    side_2_position: [],
    side_2_strand: [],
    overlap: []
}


var UN = {
    type: [],
    evidence_id: [],
    parent_ids: [],

    seq_id: [],
    start: [],
    end: []
}



function create_RA(line) {
    var obj = {};
    obj['type'] = "RA";
    obj['evidence_id'] = line[1];
    obj['parent_ids'] = line[2];

    obj['seq_id'] = line[3];
    obj['position'] = line[4];
    obj['insert_position'] = line[5];
    obj['ref_base'] = line[6];
    obj['new_base'] = line[7];


    var count = 8;
    while (count < line.length) {
        var v = line[count].split("=");
        obj[v[0]] = v[1];
        count++;
    }
    return obj;
}



function create_MC(line) {
    var obj = {};
    obj['type'] = "MC";
    obj['evidence_id'] = line[1];
    obj['parent_ids'] = line[2];

    obj['seq_id'] = line[3];
    obj['start'] = line[4];
    obj['end'] = line[5];
    obj['start_range'] = line[6];
    obj['end_range'] = line[7];


    var count = 8;
    while (count < line.length) {
        var v = line[count].split("=");
        obj[v[0]] = v[1];
        count++;
    }
    return obj;
}


function create_JC(line) {
    var obj = {};
    obj['type'] = "JC";
    obj['evidence_id'] = line[1];
    obj['parent_ids'] = line[2];

    obj['side_1_seq_id'] = line[3];
    obj['side_1_position'] = line[4];
    obj['side_1_strand'] = line[5];
    obj['side_2_seq_id'] = line[6];
    obj['side_2_position'] = line[7];
    obj['side_2_strand'] = line[8];
    obj['overlap'] = line[9];

    var count = 10;
    while (count < line.length) {
        var v = line[count].split("=");
        obj[v[0]] = v[1];
        count++;
    }
    return obj;
}



function create_UN(line) {
    var obj = {};
    obj['type'] = "UN";
    obj['evidence_id'] = line[1];
    obj['parent_ids'] = line[2];

    obj['seq_id'] = line[3];
    obj['start'] = line[4];
    obj['end'] = line[5];

    var count = 6;
    while (count < line.length) {
        var v = line[count].split("=");
        obj[v[0]] = v[1];
        count++;
    }
    return obj;
}


//-------------------------------------------------------


const fs = require('fs');
const readline = require('readline');


// const rl = readline.createInterface({
//     input: fs.createReadStream(filename),
//     crlfDelay: Infinity
// });




function readFile(f) {
    var m_e_list = {};
    var file = f.split("/");
    var filename = file[file.length-1];
    if (file[file.length-2] == "cocultures") {
        m_e_list.type = "C";
        console.log(file[file.length-2] + "typpeeeeeeeeeeeeeeeeee");
    } else if (file[file.length-2] == "monocultures") {
        m_e_list.type = "M";
        console.log(file[file.length-2] + "typpeeeeeeeeeeeeeeeeee");
    } else {
        m_e_list.type = "O";
    }

    m_e_list.culture = filename.split("_")[0];
    // console.log(filename.split("_")[0] + "pppppppppppppppppppppp");

    m_e_list.generation  = parseInt((filename.split("_"))[1].split(".")[0]);


    var lineCounter = 0;
    var mutation_list = [];
    var evidence_list = [];

    fs.readFileSync(f).toString().split('\n').forEach(function (line) {
        var check = line.split('\t');
        // if (line.charAt(0) == '#') {
        //     console.log(check[0]);
        //     //https://stackoverflow.com/questions/6260756/how-to-stop-javascript-foreach
        //     // no break for a forEach loop
        //     // break;
        // }
        if (check[0]=='SNP' || check[0]=='SUB' ||check[0]=='DEL' ||check[0]=='INS') {

            var l = line.split('\t');
            var obj = []
            // console.log(l)
            if (l[0] == 'SNP') {
                obj = create_SNP(l);
            }


            if (l[0] == 'SUB') {
                obj = create_SUB(l);
            }

            if (l[0] == 'DEL') {
                obj = create_DEL(l);
            }

            if (l[0] == 'INS') {
                obj = create_INS(l);
            }
            mutation_list.push(obj);
        }


        if (check[0] == 'RA' || check[0] == 'MC' || check[0] == 'JC' || check[0] == 'UN') {
            var l = line.split('\t');
            var obj = []
            // console.log(l)
            if (l[0] == 'RA') {
                obj = create_RA(l);
            }
            if (l[0] == 'MC') {
                obj = create_MC(l);
            }
            if (l[0] == 'JC') {
                obj = create_JC(l);
            }
            if (l[0] == 'UN') {
                obj = create_UN(l);
            }
            evidence_list.push(obj)
        }


        lineCounter++;
    });
    // console.log(mutation_list);
    // console.log(evidence_list);
    // console.log(lineCounter);
    // console.log("---------------" + evidence_list.length);
    // console.log(mutation_list.length);
    m_e_list.mutations = mutation_list;
    m_e_list.evidences = evidence_list;
    // console.log(m_e_list);
    return m_e_list;
}

// function parse(filename){
//     this.filename = filename;
// }
// var filename = "../resources/feb_23/cocultures/HA3_100.gd"
// var temp = readFile(filename);
// console.log(temp.mutations[0])

module.exports = {

    readFile: readFile

}



