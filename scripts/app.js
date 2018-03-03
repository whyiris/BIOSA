$(document).ready(function () {

    new Vue({
        el: "#app",
        created: function () {
            var self = this;
            $.ajax({
                url: "query?db=BIOSA&collections",
                dataType: "json",
                success: function (result) {
                    self.collections = result.result;
                }
            })
        },
        data: {
            collections: null,
            coculture: null,
            monoculture: null,
            loading: false,
            loadingCoculture: false,
            loadingMonoculture: false,
            generationCTable: null,
            generationMTable: null

        },
        methods: {
            getCultures: function (event) {
                this.loadingCoculture = true;
                this.loadingMonoculture = true;
                var collection = event.target.textContent;
                var self = this;
                var requestCoculture = $.ajax({
                    url: "query?db=BIOSA&collection=" + collection + "&cultureType=C",
                    dataType: "json"
                });

                var requestMonoculture = $.ajax({
                    url: "query?db=BIOSA&collection=" + collection + "&cultureType=M",
                    dataType: "json"
                });

                $.when(requestCoculture, requestMonoculture).done(function (retC, retM) {
                    self.coculture = retC[0].result;
                    self.monoculture = retM[0].result;



                    var ccResult = [], ccDeferred, ccDeffereds = [];
                    var mcResult = [], mcDeferred, mcDeffereds = [];

                    for (var i = 0; i < self.coculture.length; i++) {
                        deferred = $.ajax({
                            url: "query?db=BIOSA&collection=" + collection + "&culture=" + self.coculture[i],
                            dataType: "json",
                            success: function (result) {
                                ccResult.push(result);
                            }
                        });
                        ccDeffereds.push(ccDeferred);
                    }
                    $.when.apply($, ccDeffereds).then(function() {
                        console.log(ccResult);
                        self.loadingCoculture = false;
                    });

                    for (var i = 0; i < self.monoculture.length; i++) {
                        deferred = $.ajax({
                            url: "query?db=BIOSA&collection=" + collection + "&culture=" + self.monoculture[i],
                            dataType: "json",
                            success: function (result) {
                                mcResult.push(result);
                            }
                        });
                        mcDeffereds.push(mcDeferred);
                    }
                    $.when.apply($, mcDeffereds).then(function() {
                        console.log(mcResult);
                        self.loadingMonoculture = false;
                    })

                });
            },
            setCCTable: function (genList) {
                var temp = {};
                var self = this;
                // console.log("genlist: ", genList);
                // console.log("test: ", genList[1]);
                // console.log(genList.responseJSON);
                // genList.forEach(function(generation){
                //     generation.responseJSON.forEach(function(response){
                //         temp[response.culture] = response.result;
                //         self.generationCTable.push(temp);
                //     });
                // });
                // console.log(self.generationCTable)


                // console.log("list: " , typeof(genList[3]), " $$ ", genList[3])
                // console.log("JSON: ", genList[3].promise)
                // console.log("JSON: ", genList[3].responseJSON)
                // console.log("culture: ", genList[3].responseJSON.culture);
                // console.log("result: ", genList[3].responseJSON.result);
                // console.log("############################")
                //
                // for(var i in genList) {
                //     console.log("############################")
                //     console.log("list: " , genList[i])
                //     console.log("JSON: ", genList[i].responseJSON)
                //     console.log("culture: ", genList[i].responseJSON.culture);
                //     console.log("result: ", genList[i].responseJSON.result);
                //     // temp.genList[i].responseJSON.culture = genList[i].responseJSON.result;
                //     // console.log(i, " ", temp)
                //     // self.generationCTable.push(temp);
                // }
                // console.log(self.generationCTable)
                for (var i = 0; i < genList.length; i++) {
                    console.log(genList[i])

                    console.log(genList[i].response)
                }
            }

        }
    });
});