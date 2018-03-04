$(document).ready(function () {

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
            selectButtonMsg: "Select Collection"
        },
        methods: {
            reset: function() {
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
                    // self.ccGens = _.omit(self.ccGens, 'Ancestor');
                    self.ccList = retC[0].result;
                    self.ccList.shift();            // TODO: Ancestor is not a "culture"
                    self.mcList = retM[0].result;
                    // console.log("ccList: ", self.ccList); // TODO: DEBUG list of cocultures
                    // console.log("mcList: ", self.mcList); // TODO: DEBUG list of monocultures

                    // query generations for all monoculture and cocultures
                    var ccResult = [], ccDeferred, ccDeffereds = [];
                    var mcResult = [], mcDeferred, mcDeffereds = [];

                    // runs when all ajax queries for mc/cc gens are finished, and resets it back
                    $(document).ajaxStop(function () {
                        // 0 === $.active
                        self.processResults(ccResult,"cc");
                        self.processResults(mcResult, "mc");
                        self.normalizeHeader();
                        self.fillEmptySlots(self.ccGens, self.ccHeaders);
                        self.fillEmptySlots(self.mcGens, self.mcHeaders);
                        self.loadingMC = false;
                        self.loadingCC = false;
                        self.disableSelect = false;
                        self.selectButtonMsg = "Select Collection";
                        $(this).off("ajaxStop");
                    });

                    // query for all generations from cococultures
                    for (var i = 0; i < self.ccList.length; i++) {
                        deferred = $.ajax({
                            url: "query?db=BIOSA&collection=" + collection + "&culture=" + self.ccList[i],
                            dataType: "json",
                            success: function (result) {
                                ccResult.push(result);
                            }
                        });
                        ccDeffereds.push(ccDeferred);
                    }
                    // $.when.apply($, ccDeffereds).then(function() { // doesn't work
                    //         console.log(ccResult);
                    //         self.setCCTable(ccResult);
                    //         self.loadingCC = false;
                    // });


                    //query for all generations from mcList
                    for (var i = 0; i < self.mcList.length; i++) {
                        deferred = $.ajax({
                            url: "query?db=BIOSA&collection=" + collection + "&culture=" + self.mcList[i],
                            dataType: "json",
                            success: function (result) {
                                mcResult.push(result);
                            }
                        });
                        mcDeffereds.push(mcDeferred);
                    }
                });
            },
            processResults: function (result, cultureType) {
                var self = this;
                var tempGenList = [];

                result.forEach(function(obj){
                    var temp = {};
                    var currGenList = obj.result;  // list of generations for the current culture

                    if(cultureType === "cc") {
                        currGenList.unshift(0);   // insert a 0th generation
                    }
                    temp["culture"] = obj.culture;
                    temp["generations"] = currGenList;

                    if(cultureType === "cc") {
                        self.ccGens.push(temp);
                    }
                    else{
                        self.mcGens.push(temp);
                    }
                    tempGenList = currGenList.concat(tempGenList);  // extract unique generations
                    tempGenList = _.uniq(tempGenList);
                });

                // set the data's
                if(cultureType === "cc") {
                    self.ccGens = _.orderBy(self.ccGens, 'culture');
                    self.ccHeaders = tempGenList;
                    self.ccHeaders.unshift("Coculture");
                }
                else{
                    self.mcGens = _.orderBy(self.mcGens, 'culture');
                    self.mcHeaders = tempGenList.sort();
                    self.mcHeaders.unshift("Monoculture");
                }
            },
            fillEmptySlots: function(cultureGens, header) {
                var self = this;
                var gensList = cultureGens.map(function(currCulture) {return currCulture.generations});

                gensList.forEach(function(currGenList) {
                    header.slice(1).forEach(function(currHeadGen, index) {  // header will always be >= list of gens for each culture
                        var otherGen = currGenList[index];
                        if(otherGen !== currHeadGen){
                            if(otherGen > currHeadGen) { // insert before curr Index
                                currGenList.splice(index, 0, " ");
                            }
                            else{                        // insert after curr Index
                                currGenList.splice(index + 1, 0, " ");
                            }
                        }
                    });
                });
            },
            normalizeHeader: function() {
                var base;
                var normalize;
                var insertToList;
                if(this.ccHeaders.length > this.mcHeaders.length) {
                    base = this.ccHeaders;
                    normalize = this.mcHeaders;
                }
                else {
                    base = this.mcHeaders;
                    normalize = this.ccHeaders;
                }

                var index = 1;
                while(index < base.length) {
                    var master = base[index];
                    var child = normalize[index];
                    if(master !== child){
                        if(child > master) {
                            normalize.splice(index, 0, master);
                        }
                        else {
                            normalize.splice(index + 1, 0, master);
                        }
                    }
                    index++;
                }
            }
        }
    });
});