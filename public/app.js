
$(document).ready(function () {

    //TODO add a link to the home
    //TODO responsiveness for narrow screen
    //TODO caching for same collections query, add cookie implementation
    //TODO add name of the database
    new Vue({
        el: "#app",
        created: function () {
            this.loading = true;
            var self = this;
            $.ajax({
                url: "query?db=BIOSA&collections",
                dataType: "json",
                success: function (result) {
                    self.collections = result.result;
                    self.loading = false;
                }
            })
        },
        data: {
            collections: null,
            ccList: null,
            mcList: null,
            loading: false,
            loadingCC: false,
            loadingMC: false,
            ccGens: [],
            mcGens: [],
            ccHeaders: [],
            mcHeaders: [],
            disableSelect: false,
            selectButtonMsg: "Select Collection",

            // codes below added in spring quarter 2018
            reRender: false, // determine what content to be displayed
            reRenderMCM: false,
            reRenderCCM: false,
            reRenderCompareWeb: false,
            reRenderCompareGraph: false,
            cc_predicted_mutations: [],
            mc_predicted_mutations: [],
            cc_compare_generation:[],
            mutation_headers: ['evidence', 'seq_id', 'position', 'mutation','freq', 'annotation', 'gene', 'description'],
            compare_headers: ['seq_id', 'position', 'mutation', '0', '100', '300', '500', '780', '1000', 'annotation', 'gene', 'description']
        },
        methods: {
            reset: function () {
                this.ccGens = [];
                this.mcGens = [];
                this.ccHeaders = [];
                this.mcHeaders = [];
                this.ccList = [];
                this.mcList = []
            },
            getCultures: function (event) {
                this.reset();
                this.disableSelect = true;
                this.selectButtonMsg = "Processing ... ";
                this.loadingCC = true;
                this.loadingMC = true;
                var collection = event.target.textContent;
                var self = this;

                // querying for ccList and mcList documents, we can't assume we know all cultures ahead of time
                var requestCoculture = $.ajax({
                    url: "query?db=BIOSA&collection=" + collection + "&cultureType=C",
                    dataType: "json"
                });
                var requestMonoculture = $.ajax({
                    url: "query?db=BIOSA&collection=" + collection + "&cultureType=M",
                    dataType: "json"
                });
                $.when(requestCoculture, requestMonoculture).done(function (retC, retM) {
                    self.ccList = retC[0].result;
                    self.ccList.shift();   // be aware that there is a single Ancestor for all samples
                    self.mcList = retM[0].result;

                    // query generations for all monoculture and cocultures
                    var ccResult = [], ccDeferred, ccDeffereds = [];
                    var mcResult = [], mcDeferred, mcDeffereds = [];

                    // query for all generations from cococultures
                    for (var i = 0; i < self.ccList.length; i++) {
                        deferred = $.ajax({
                            url: "query?db=BIOSA&collection=" + collection + "&cultureType=C&culture=" + self.ccList[i],
                            dataType: "json",
                            success: function (result) {
                                ccResult.push(result);
                            }
                        });
                        ccDeffereds.push(ccDeferred);
                    }

                    //query for all generations from mcList
                    for (var i = 0; i < self.mcList.length; i++) {
                        deferred = $.ajax({
                            url: "query?db=BIOSA&collection=" + collection + "&cultureType=M&culture=" + self.mcList[i],
                            dataType: "json",
                            success: function (result) {
                                mcResult.push(result);
                            }
                        });
                        mcDeffereds.push(mcDeferred);
                    }

                    // runs when all ajax queries for mc/cc gens are finished, and resets it back
                    $(document).ajaxStop(function () {
                        self.processResults(ccResult, "cc");
                        self.processResults(mcResult, "mc");
                        //self.normalizeHeader();
                        self.fillEmptySlots(self.ccGens, self.ccHeaders);
                        self.fillEmptySlots(self.mcGens, self.mcHeaders);
                        self.loadingMC = false;
                        self.loadingCC = false;
                        self.disableSelect = false;
                        self.selectButtonMsg = "Select Collection";
                        $(this).off("ajaxStop");
                    });
                });
            },
            processResults: function (result, cultureType) {
                var self = this;
                var tempGenList = [];

                result.forEach(function (obj) {
                    var temp = {};
                    var currGenList = obj.result;  // list of generations for the current culture

                    if (cultureType === "cc") {
                        currGenList.unshift(0);   // insert a 0th generation
                    }
                    temp["culture"] = obj.culture;
                    temp["generations"] = currGenList;

                    if (cultureType === "cc") {
                        self.ccGens.push(temp);
                    }

                    else {
                        self.mcGens.push(temp);
                    }
                    tempGenList = currGenList.concat(tempGenList);  // extract unique generations
                    tempGenList = _.uniq(tempGenList);

                });

                // set the data's
                if (cultureType === "cc") {
                    self.ccGens = _.orderBy(self.ccGens, 'culture');
                    self.ccHeaders = tempGenList;
                    self.ccHeaders.unshift("Coculture");
                    self.ccHeaders.push("Compare");
                }
                else {
                    self.mcGens = _.orderBy(self.mcGens, 'culture');
                    self.mcHeaders = tempGenList.sort();
                    self.mcHeaders.unshift("Monoculture");
                    self.mcHeaders.push("Compare");

                }
            },
            fillEmptySlots: function (cultureGens, header) {
                var self = this;
                var gensList = cultureGens.map(function (currCulture) {
                    return currCulture.generations
                });

                gensList.forEach(function (currGenList) {
                    header.slice(1).forEach(function (currHeadGen, index) {  // header will always be >= list of gens for each culture
                        var otherGen = currGenList[index];
                        if (otherGen !== currHeadGen) {
                            if (otherGen > currHeadGen) { // insert before curr Index
                                currGenList.splice(index, 0, " ");
                            }
                            else {                        // insert after curr Index
                                currGenList.splice(index + 1, 0, " ");
                            }
                        }
                    });
                    currGenList[currGenList.length-1] = "compare";
                });
            },
            normalizeHeader: function () {
                var base;
                var normalize;
                if (this.ccHeaders.length > this.mcHeaders.length) {
                    base = this.ccHeaders;
                    normalize = this.mcHeaders;
                }
                else {
                    base = this.mcHeaders;
                    normalize = this.ccHeaders;
                }

                var index = 1;
                while (index < base.length) {
                    var master = base[index];
                    var child = normalize[index];
                    if (master !== child) {
                        if (child > master) {
                            normalize.splice(index, 0, master);
                        }
                        else {
                            normalize.splice(index + 1, 0, master);
                        }
                    }
                    index++;
                }
            },

            // this function is to change the state of reRender variable and help determine what corresponding table should be displayed
            reactToButtons: function(){
                this.reRender = !this.reRender;
            },
            generateCCTable: function(event){
                this.reRenderMCM = false;
                this.reRenderCCM = true;
                var self = this;
                $("#gen-cc-table td").click(function() {
                    var column_num = parseInt( $(this).index() )-1;
                    var row_num = parseInt( $(this).parent().index() );

                    var gen = String(self.ccGens[row_num].generations[column_num]);
                    var cul = String(self.ccList[row_num]);

                    if (cul != "" && gen != " " && gen != "compare"){
                        console.log(column_num);
                        console.log(self.ccGens[row_num]);
                        var requestTable = $.ajax({
                            url: "query?db=BIOSA&collection=CULTURES_02232018&cultureType=C&culture=" + cul + "&generation=" + gen,
                            dataType: "json"
                        });
                        $.when(requestTable).done(function (retT) {

                            // make a map for evidences data
                            var evidence_data_map = {};
                            for (var i = 0; i < retT.result.evidences.length; i++) {
                                var data = retT.result.evidences[i];
                                // console.log(retT);
                                evidence_data_map[data.evidence_id] = [data.type, data.ref_base, data.new_base];
                            }

                            // query for all generations from cocultures
                            for (var i = 0; i < retT.result.mutations.length; i++) {
                                var data = retT.result.mutations[i];
                                // console.log(data);
                                // this if else is for finding gene
                                var gene_name_value = null;
                                if (data.hasOwnProperty("gene_name")) {
                                    if (data.hasOwnProperty("gene_strand")){
                                        gene_name_value = data.gene_name + " " + data.gene_strand;
                                    }
                                    else{
                                        gene_name_value = data.gene_name;
                                    }
                                }

                                // this part is for finding annotation
                                var annotation_value = null;
                                if (data.type === "DEL" && !data.hasOwnProperty("gene_position")){
                                    // some DELs don't have gene_position, keeps it null
                                }
                                else if (data.type !== "SNP" || data.gene_position){
                                    annotation_value = data.gene_position;
                                }
                                else{   // this is for SNP without gene_position
                                    annotation_value = data.aa_ref_seq + data.aa_position + data.aa_new_seq
                                        + " (" + data.codon_ref_seq + "->" + data.codon_new_seq + ")";
                                }

                                // // this part formats frequency
                                var freq_val = ((Number(data.frequency)) * 100).toFixed(1);
                                if (freq_val === "100.0"){
                                    freq_val = "100%";
                                }
                                else{
                                    freq_val = freq_val + "%";
                                }

                                // this part is for evidence field
                                var evid_types = "";
                                var parent_ids = data.parent_ids;
                                var parent_id_list = parent_ids.split(",");

                                for (var j = 0; j < parent_id_list.length; j++){
                                    evid_types += evidence_data_map[parent_id_list[j]][0];

                                }

                                // this part is for mutation
                                var mutation = "";
                                if (data.type === "INS"){
                                    mutation = "+" + data.new_seq;
                                }
                                else if (data.type === "DEL"){
                                    mutation = "∆" + data.size + " bp";
                                }
                                else if (data.type === "SUB"){
                                    mutation = data.size + " bp -> " + data.new_seq;
                                }
                                else if (data.type === "MOB"){
                                    if(data.strand === "1"){
                                        mutation = data.repeat_name + "+" + data.duplication_size + " bp";
                                    }else{
                                        mutation = data.repeat_name + "-" + data.duplication_size + " bp";
                                    }
                                }
                                else if (data.type === "SNP"){
                                    mutation = evidence_data_map[data.parent_ids][1] + "->" + evidence_data_map[data.parent_ids][2];
                                }

                                var evidence_obj = {
                                    evidence_type: evid_types,
                                    seq_id: data.seq_id,
                                    position: data.position,
                                    mutation_field: mutation,
                                    freq: freq_val,
                                    annotation: annotation_value,
                                    gene: gene_name_value,
                                    description: data.gene_product
                                };

                                self.cc_predicted_mutations.push(evidence_obj);
                            }

                        });
                    }
                    else
                    {
                        console.log("we are in else");
                    }
                });
            },
            generateMCTable: function(event){
                this.reRenderMCM = true;
                this.reRenderCCM = false;
                var self = this;
                $("#gen-mc-table td").click(function() {
                    var column_num = parseInt( $(this).index() )-1;
                    var row_num = parseInt( $(this).parent().index() );

                    var gen = String(self.mcGens[row_num].generations[column_num]);
                    var cul = String(self.mcList[row_num]);

                    if (cul != "" && gen != " "){
                        var requestTable = $.ajax({
                            url: "query?db=BIOSA&collection=CULTURES_02232018&cultureType=M&culture=" + cul + "&generation=" + gen,
                            dataType: "json"
                        });
                        $.when(requestTable).done(function (retT) {

                            // make a map for evidences data
                            var evidence_data_map = {};
                            for (var i = 0; i < retT.result.evidences.length; i++) {
                                var data = retT.result.evidences[i];
                                evidence_data_map[data.evidence_id] = [data.type, data.ref_base, data.new_base];
                            }

                            // query for all generations from cococultures
                            for (var i = 0; i < retT.result.mutations.length; i++) {
                                var data = retT.result.mutations[i];

                                // this if else is for finding gene
                                var gene_name_value = null;
                                if (data.hasOwnProperty("gene_name")) {
                                    if (data.hasOwnProperty("gene_strand")){
                                        gene_name_value = data.gene_name + " " + data.gene_strand;
                                    }
                                    else{
                                        gene_name_value = data.gene_name;
                                    }
                                }

                                // this part is for finding annotation
                                var annotation_value = null;
                                if (data.type === "DEL" && !data.hasOwnProperty("gene_position")){
                                    // some DELs don't have gene_position, keeps it null
                                }
                                else if (data.type !== "SNP" || data.gene_position){
                                    annotation_value = data.gene_position;
                                }
                                else{   // this is for SNP without gene_position
                                    annotation_value = data.aa_ref_seq + data.aa_position + data.aa_new_seq
                                        + " (" + data.codon_ref_seq + "->" + data.codon_new_seq + ")";
                                }

                                // // this part formats frequency
                                var freq_val = ((Number(data.frequency)) * 100).toFixed(1);
                                if (freq_val === "100.0"){
                                    freq_val = "100%";
                                }
                                else{
                                    freq_val = freq_val + "%";
                                }

                                // this part is for evidence field
                                var evid_types = "";
                                var parent_ids = data.parent_ids;
                                var parent_id_list = parent_ids.split(",");

                                //console.log(parent_id_list);

                                for (var j = 0; j < parent_id_list.length; j++){
                                    evid_types += evidence_data_map[parent_id_list[j]][0];

                                }

                                // this part is for mutation
                                var mutation = "";
                                if (data.type === "INS"){
                                    mutation = "+" + data.new_seq;
                                }
                                else if (data.type === "DEL"){
                                    mutation = "∆" + data.size + " bp";
                                }
                                else if (data.type === "SUB"){
                                    mutation = data.size + " bp -> " + data.new_seq;
                                }
                                else if (data.type === "MOB"){
                                    if(data.strand === "1"){
                                        mutation = data.repeat_name + "+" + data.duplication_size + " bp";
                                    }else{
                                        mutation = data.repeat_name + "-" + data.duplication_size + " bp";
                                    }
                                }
                                else if (data.type === "SNP"){
                                    mutation = evidence_data_map[data.parent_ids][1] + "->" + evidence_data_map[data.parent_ids][2];
                                }



                                var evidence_obj = {
                                    description: data.gene_product,
                                    freq: freq_val,
                                    position: data.position,
                                    seq_id: data.seq_id,
                                    gene: gene_name_value,
                                    annotation: annotation_value,
                                    evidence_type: evid_types,
                                    mutation_field: mutation
                                };

                                self.mc_predicted_mutations.push(evidence_obj);
                            }

                        });
                    }
                    else
                    {
                        console.log("we are in else");
                    }
                });
            },
            generateCompareTable: function(event){
                this.reRenderMCM = false;
                this.reRenderCCM = false;
                this.reRenderCompareWeb = true;
                var self = this;
                console.log("in generate compare table!!!!!!!!!!")
                $("#gen-cc-table td").click(function() {
                    var column_num = parseInt( $(this).index() )-1;
                    var row_num = parseInt( $(this).parent().index() );

                    var gen = String(self.ccGens[row_num].generations[column_num]);
                    var cul = String(self.ccList[row_num]);
                    if (cul != "" && gen === "compare") {

                        var requestTable = $.ajax({
                            url: "query?db=BIOSA&collection=CULTURES_02232018&cultureType=C&culture=" + cul+ "&generation=" + gen,
                            dataType: "json"
                        });
                        $.when(requestTable).done(function (retT) {

                            // make a map for evidences data
                            var evidence_data_map = {};
                            console.log(retT.result);
                            for (var res in retT.result) {
                                // console.log(retT.result[res]);
                                var data = retT.result[res];

                                var seq_id = data.seq_id[0];

                                var type = data.type[0];
                                var mutation_data = data.mutation[0];
                                var mutation = "";
                                switch(type) {
                                    case "INS":
                                        mutation = "+" + mutation_data.new_seq;
                                        break;
                                    case "DEL":
                                        mutation = "∆" + mutation_data.size + " bp";
                                        break;
                                    case "SUB":
                                        mutation = mutation_data.size + " bp -> " + mutation_data.new_seq;
                                        break;
                                    case "MOB":
                                        if (mutation_data.strand === "1") {
                                            mutation = mutation_data.repeat_name + "+" + mutation_data.duplication_size + " bp";
                                        } else {
                                            mutation = mutation_data.repeat_name + "-" + mutation_data.duplication_size + " bp";
                                        }
                                        break;
                                    case "SNP":
                                        mutation = mutation_data.ref_base + "->" + mutation_data.new_base;
                                        break;
                                }

                                var freq_map = {
                                    freq_0: 0,
                                    freq_100: 0,
                                    freq_300: 0,
                                    freq_500: 0,
                                    freq_780: 0,
                                    freq_1000: 0
                                };
                                for (var index in data.frequency) {
                                    var frequency = "freq_" + data.frequency[index].generation;
                                    freq_map[frequency] = (parseFloat(data.frequency[index].freq)*100).toFixed(1);
                                }

                                var annotation_data = data.annotation[0];
                                var annotation = "";
                                if (type !== "SNP" || annotation_data.gene_position){
                                    annotation = annotation_data.gene_position;
                                }
                                else {
                                    annotation = annotation_data.aa_ref_seq + annotation_data.aa_position + annotation_data.aa_new_seq
                                        + " (" + annotation_data.codon_ref_seq + "->" + annotation_data.codon_new_seq + ")";
                                }

                                var gene_data = data.gene[0];
                                var gene = "";
                                if (gene_data.hasOwnProperty("gene_strand")) {
                                    gene = gene_data.gene_name + " " + gene_data.gene_strand;
                                } else {
                                    gene = gene_data.gene_name;
                                }

                                var description = data.description[0];

                                var compare_obj = {
                                    seq_id: seq_id,
                                    position: data._id,
                                    mutation: mutation,
                                    freq_0: freq_map.freq_0,
                                    freq_100: freq_map.freq_100,
                                    freq_300: freq_map.freq_300,
                                    freq_500: freq_map.freq_500,
                                    freq_780: freq_map.freq_780,
                                    freq_1000: freq_map.freq_1000,
                                    annotation: annotation,
                                    gene: gene,
                                    description: description
                                };
                                self.cc_compare_generation.push(compare_obj);
                            }

                        });
                    }
                });
            },
            generateCompareGraph: function(event) {
                this.reRenderMCM = false;
                this.reRenderCCM = false;
                this.reRenderCompareWeb = false;
                this.reRenderCompareGraph = true;
                var self = this;
                console.log("in generate Compare Graph");
                $("#gen-cc-table td").click(function() {
                    var column_num = parseInt( $(this).index() )-1;
                    var row_num = parseInt( $(this).parent().index() );

                    var gen = String(self.ccGens[row_num].generations[column_num]);
                    var cul = String(self.ccList[row_num]);
                    var plotting_data = [];
                    if (cul != "" && gen === "compare") {

                        var requestTable = $.ajax({
                            url: "query?db=BIOSA&collection=CULTURES_02232018&cultureType=C&culture=" + cul+ "&generation=" + gen,
                            dataType: "json"
                        });
                        $.when(requestTable).done(function (retT) {
                            for (var res in retT.result) {
                                // console.log(retT.result[res]);
                                var data = retT.result[res];

                                var seq_id = data.seq_id[0];

                                var freq_map = {
                                    freq_0: 0,
                                    freq_100: 0,
                                    freq_300: 0,
                                    freq_500: 0,
                                    freq_780: 0,
                                    freq_1000: 0
                                };

                                for (var index in data.frequency) {
                                    var frequency = "freq_" + data.frequency[index].generation;
                                    freq_map[frequency] = (parseFloat(data.frequency[index].freq)*100).toFixed(1);
                                }

                                var trace = {
                                    x: [0, 100, 300, 500, 780, 1000],
                                    y: [
                                        parseFloat(freq_map.freq_0),
                                        parseFloat(freq_map.freq_100),
                                        parseFloat(freq_map.freq_300),
                                        parseFloat(freq_map.freq_500),
                                        parseFloat(freq_map.freq_780),
                                        parseFloat(freq_map.freq_1000)
                                    ],
                                    name: seq_id + " " + data._id,
                                    type: 'scatter'
                                };

                                plotting_data.push(trace);

                                var compare_obj = {
                                    seq_id: seq_id,
                                    position: data._id,
                                    freq_0: freq_map.freq_0,
                                    freq_100: freq_map.freq_100,
                                    freq_300: freq_map.freq_300,
                                    freq_500: freq_map.freq_500,
                                    freq_780: freq_map.freq_780,
                                    freq_1000: freq_map.freq_1000,
                                };
                                self.cc_compare_generation.push(compare_obj);

                            }
                            Plotly.plot(document.getElementById('tester'), plotting_data, layout, {responsive: true});
                            console.log("----------------------plotting data is ------------------------");
                            console.log(plotting_data);
                        });

                        var layout = {
                            title: "Graph",
                            font: {size: 12}
                        };

                    }

                });

            }
        }
    });
});

