var database = require('./mutations');
database.connect();

(function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}(2000))

var entry = ["HE3", 100, "SNP", 182, "1550", "NC_005791", 780927, "G", "V",704,"L","GTA",704,1,"TTA",0.0735840797,"MMP0788","MMP0788","2110", "hypothetical protein",">", "<i>MMP0788</i>&nbsp;&rarr;", "MMP0788", "nonsynonymous", 11]

database.insert(entry)