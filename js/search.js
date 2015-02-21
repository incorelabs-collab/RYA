var searchMiniApp = {
    openSearchForm: function () {
        $("#memberName").val("");
        $("#bloodGroup").val("");
        $("#memberOccupation").val("");
        $('#searchModal').modal('show');
    },
    validateSearchForm: function() {
        if($("#memberName").val() == "" && $("#bloodGroup").val() == "" && $("#memberOccupation").val() == "") {
            navigator.notification.alert("Please choose a Search criteria.", app.alertDismissed, 'Search Criteria Missing', 'Try Again');
        } else {
            searchMiniApp.search();
        }
    },
    search: function() {
        var activeFields = [];
        var searchData = $('#searchForm').serializeArray();
        var i = 0;
        $.each(searchData, function(index, val) {
            if(val.value != "") {
                activeFields[i] = true;
            } else {
                activeFields[i] = false;
            }
            i++;
        });
        var memberName = $("#memberName").val();
        var bloodGroup = $("#bloodGroup").val();
        var memberOccupation = $("#memberOccupation").val();
        var queryString = [];
        queryString[0] = "SELECT id, Name FROM male WHERE";
        queryString[1] = "SELECT id, Name FROM s_male WHERE";
        queryString[2] = "SELECT id, Name FROM female WHERE";
        queryString[3] = "SELECT id, Name FROM s_female WHERE";
        queryString[4] = "SELECT id, Name FROM kids WHERE";
        queryString[5] = "SELECT id, Name FROM s_kids WHERE";
        var nameQueryString = "Name LIKE '%"+memberName+"%'";
        var bloodQueryString = "Blood_Group = '"+bloodGroup+"'";
        var occupationQueryString = "Occupation LIKE '%"+memberOccupation+"%'";
        if(activeFields[0]) {
            queryString[0] += " " + nameQueryString;
            queryString[1] += " " + nameQueryString;
            queryString[2] += " " + nameQueryString;
            queryString[3] += " " + nameQueryString;
            queryString[4] += " " + nameQueryString;
            queryString[5] += " " + nameQueryString;
            if(activeFields[1]) {
                queryString[0] += " AND "+bloodQueryString;
                queryString[1] += " AND "+bloodQueryString;
                queryString[2] += " AND "+bloodQueryString;
                queryString[3] += " AND "+bloodQueryString;
                queryString[4] += " AND "+bloodQueryString;
                queryString[5] += " AND "+bloodQueryString;
                if(activeFields[2]) {
                    queryString[0] += " AND "+occupationQueryString;
                    queryString[1] += " AND "+occupationQueryString;
                    queryString[2] += " AND "+occupationQueryString;
                    queryString[3] += " AND "+occupationQueryString;
                    queryString.pop();                                  //   Kids have no occupation.
                    queryString.pop();                                  //   s_Kids have no occupation.
                }
            }
        }
        else if(activeFields[1]) {
            queryString[0] += " " + bloodQueryString;
            queryString[1] += " " + bloodQueryString;
            queryString[2] += " " + bloodQueryString;
            queryString[3] += " " + bloodQueryString;
            queryString[4] += " " + bloodQueryString;
            queryString[5] += " " + bloodQueryString;
            if(activeFields[2]) {
                queryString[0] += " AND "+occupationQueryString;
                queryString[1] += " AND "+occupationQueryString;
                queryString[2] += " AND "+occupationQueryString;
                queryString[3] += " AND "+occupationQueryString;
                queryString.pop();                                      //   Kids have no occupation.
                queryString.pop();                                  //   s_Kids have no occupation.
            }
        }
        else if(activeFields[2]) {
            queryString[0] += " " + occupationQueryString;
            queryString[1] += " " + occupationQueryString;
            queryString[2] += " " + occupationQueryString;
            queryString[3] += " " + occupationQueryString;
            queryString.pop();                                          //   Kids have no occupation.
            queryString.pop();                                          //   s_Kids have no occupation.
        }
        var k = 0;
        var resultsID = [];
        var resultsName = [];

        var maleResults = {id:[], name:[]};
        var sMaleResults = {id:[], name:[]};
        var femaleResults = {id:[], name:[]};
        var sFemaleResults = {id:[], name:[]};
        var kidsResults = {id:[], name:[]};
        var sKidsResults = {id:[], name:[]};

        app.db.transaction(function(tx){
            var defMale = $.Deferred();
            var defSMale = $.Deferred();
            var defFemale = $.Deferred();
            var defSFemale = $.Deferred();
            var defKids = $.Deferred();
            var defSKids = $.Deferred();
            tx.executeSql(queryString[0],[],
                function(tx, r){
                    for(var j =0; j< r.rows.length; j++) {
                        maleResults.id[j] = r.rows.item(j).id;
                        maleResults.name[j] = r.rows.item(j).Name;
                    }
                    defMale.resolve();
                },
                app.dbQueryError
            );
            tx.executeSql(queryString[1],[],
                function(tx, r){
                    for(var j =0; j< r.rows.length; j++) {
                        sMaleResults.id[j] = r.rows.item(j).id;
                        sMaleResults.name[j] = r.rows.item(j).Name;
                    }
                    defSMale.resolve();
                },
                app.dbQueryError
            );
            tx.executeSql(queryString[2],[],
                function(tx, r){
                    for(var j =0; j< r.rows.length; j++) {
                        femaleResults.id[j] = r.rows.item(j).id;
                        femaleResults.name[j] = r.rows.item(j).Name;
                    }
                    defFemale.resolve();
                },
                app.dbQueryError
            );
            tx.executeSql(queryString[3],[],
                function(tx, r){
                    for(var j =0; j< r.rows.length; j++) {
                        sFemaleResults.id[j] = r.rows.item(j).id;
                        sFemaleResults.name[j] = r.rows.item(j).Name;
                    }
                    defSFemale.resolve();
                },
                app.dbQueryError
            );

            if(queryString.length > 4) {
                tx.executeSql(queryString[4],[],
                    function(tx, r){
                        for(var j =0; j< r.rows.length; j++) {
                            kidsResults.id[j] = r.rows.item(j).id;
                            kidsResults.name[j] = r.rows.item(j).Name;
                        }
                        defKids.resolve();
                    },
                    app.dbQueryError
                );
                tx.executeSql(queryString[5],[],
                    function(tx, r){
                        for(var j =0; j< r.rows.length; j++) {
                            sKidsResults.id[j] = r.rows.item(j).id;
                            sKidsResults.name[j] = r.rows.item(j).Name;
                        }
                        defSKids.resolve();
                    },
                    app.dbQueryError
                );
                $.when(defMale, defSMale, defFemale, defSFemale, defKids, defSKids).done(function() {
                    console.log("all done");
                    console.log("male", maleResults.id, maleResults.name);
                    console.log("female", femaleResults.id, femaleResults.name);
                    console.log("kids", kidsResults.id, kidsResults.name);
                    console.log("s_male", sMaleResults.id, sMaleResults.name);
                    console.log("s_female", sFemaleResults.id, sFemaleResults.name);
                    console.log("s_kids", sKidsResults.id, sKidsResults.name);
                });
            } else {
                $.when(defMale, defSMale, defFemale, defSFemale).done(function() {
                    console.log("all done");
                    console.log("male", maleResults.id, maleResults.name);
                    console.log("female", femaleResults.id, femaleResults.name);
                    console.log("kids", kidsResults.id, kidsResults.name);
                    console.log("s_male", sMaleResults.id, sMaleResults.name);
                    console.log("s_female", sFemaleResults.id, sFemaleResults.name);
                    console.log("s_kids", sKidsResults.id, sKidsResults.name);
                });

            }
        });
        /*app.db.transaction(function (tx) {
            tx.executeSql(queryString[0], [],
                function(tx, r) {
                    for(var j =0; j< r.rows.length; j++) {
                        resultsID[k] = r.rows.item(j).id;
                        resultsName[k] = r.rows.item(j).Name;
                        k++;
                    }
                    app.db.transaction(function (tx) {
                        tx.executeSql(queryString[1], [],
                            function(tx, r) {
                                for(var j =0; j< r.rows.length; j++) {
                                    resultsID[k] = r.rows.item(j).id;
                                    resultsName[k] = r.rows.item(j).Name;
                                    k++;
                                }
                                if(queryString.length == 3) {               // Kids Data
                                    app.db.transaction(function (tx) {
                                        tx.executeSql(queryString[2], [],
                                            function(tx, r) {
                                                for(var j =0; j< r.rows.length; j++) {
                                                    resultsID[k] = r.rows.item(j).id;
                                                    resultsName[k] = r.rows.item(j).Name;
                                                    k++;
                                                }
                                                searchMiniApp.buildSearchResults(k, resultsID, resultsName);
                                            },
                                            app.dbQueryError
                                        );
                                    });
                                } else {
                                    searchMiniApp.buildSearchResults(k, resultsID, resultsName);
                                }
                            },
                            app.dbQueryError
                        );
                    });
                },
                app.dbQueryError
            );
        });*/
    },
    buildSearchResults: function (k, resultsID, resultsName) {
        var searchConcatString = "";
        var imgDir = localStorage.getItem("imgDir");
        if(k>0) {
            for(var i=0;i<k;i++) {
                // If you subtract 10000 from the id and yields a positive result then it is a kid else parent.
                if((resultsID[i] - 10000) > 0) {
                    searchConcatString += "<div class='row singleMemberImgAndData'><div class='col-xs-6 singleMemberImgData'><img src='"+imgDir+resultsID[i]+".jpg' class='img-responsive' onerror='pageSearchResults.imgError(this)'></div><div class='col-xs-6 singleData'>";
                    searchConcatString += "<a onclick='pageSearchResults.getKidsModal("+resultsID[i]+")' class='memberLink'><span>"+resultsName[i]+"</span></a></div></div><br/>";
                } else {
                    var imgId = resultsID[i];
                    if(resultsID[i] % 2 == 0) {
                        imgId = imgId - 1;
                    }
                    searchConcatString += "<div class='row singleMemberImgAndData'><div class='col-xs-6 singleMemberImgData'><img src='"+imgDir+imgId+".jpg' class='img-responsive' onerror='pageSearchResults.imgError(this)'></div><div class='col-xs-6 singleData'>";
                    searchConcatString += "<a onclick='pageSearchResults.getParentPage("+resultsID[i]+")' class='memberLink'><span>"+resultsName[i]+"</span></a></div></div><br/>";
                }
            }
        } else {
            searchConcatString = "<div><h2>NO RESULTS FOUND !! </h2></div>"
        }
        app.setBackPage(app.getCurrentPage());
        $('#searchModal').modal('hide');
        localStorage.setItem("searchData", searchConcatString);
        setTimeout(function () {
            app.displayPage("search_results.html");
        },100);
        searchConcatString = "";
    }
}