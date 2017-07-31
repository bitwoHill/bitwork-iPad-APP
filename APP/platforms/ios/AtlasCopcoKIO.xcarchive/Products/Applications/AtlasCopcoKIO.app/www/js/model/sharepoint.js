var SharePoint = {

    sharePointRequest: function (listName, callback, bolLoadLookups, dateFilter) {
        // var DateFilter1 = "", DateFilter2 = "";
        //get latest sync date

        //console.log("Build Date Filter");
        //filter Database based on ID of SP Item
        SyncModel.getSyncDateYDM(listName, function (FilterDate) {
            //  console.log("List: " + listName);
            //  if (listName === "Dokumente" || listName === "Infothek")
            //{
            // DateFilter1 = "/?$filter=Geändert%20ge%20datetime%27" + FilterDate + "%27";
            //console.log("finished filter:" + DateFilter1);
            //};
            //see if sharepoint Paging is intact if so - recursive call

            //Filter needs to be expanded in order to get multilookup values
            var ExpandFilter = "";
            var deleteItems = true;
            if (bolLoadLookups && bolLoadLookups == true) {
                // console.log("bolLoadLookups");
                // console.log(bolLoadLookups);
                // console.log("listName");
                // console.log(listName);


                if (listName == "Infothek") {
                    if (dateFilter) {
                        ExpandFilter = "?$filter=Geändert%20ge%20datetime%27" + dateFilter + "%27";
                        deleteItems = false; // bei dem sync (fast sync) werden nur die aktuellsten elemente geladen. deswegen muss im callback das löschen der elemente unterbunden werden, die nicht vom SP zurück gekommen sind
                    }
                }
                if (listName == "Dokumenttypen")
                    deleteItems = false; // bei dem sync (fast sync) werden nur die aktuellsten elemente geladen. deswegen muss im callback das löschen der elemente unterbunden werden, die nicht vom SP zurück gekommen sind                    


                if (listName == "Dokumente") {
                    ExpandFilter = "?$expand=Equipment,Produktgruppe,Produktfamilie,Produktplattform,Produkt&$select=Name,DokumenttypId,Pfad,Geändert,Produktgruppe/ID,Produktfamilie/ID,Produktplattform/ID,Produkt/ID,Equipment/ID";
                    if (dateFilter) {
                        ExpandFilter += "&$filter=Geändert%20ge%20datetime%27" + dateFilter + "%27";
                        deleteItems = false; // bei dem sync (fast sync) werden nur die aktuellsten elemente geladen. deswegen muss im callback das löschen der elemente unterbunden werden, die nicht vom SP zurück gekommen sind                    
                    }
                }
                if (listName == "ProduktbezeichnungOptionen")
                    ExpandFilter = "?$expand=ProduktbezeichnungEquipment,Produktgruppe,Produktfamilie,Produktplattform,Produkt&$select=*,Produktgruppe/ID,Produktfamilie/ID,Produktplattform/ID,Produkt/ID,ProduktbezeichnungEquipment/ID";
            }
 console.log(Settings.spDomain + "/" + listName + ExpandFilter);
                    console.log("1nd attempt");
            var jqXHR = $.ajax({
                type: 'GET',
                url: Settings.spDomain + "/" + listName + ExpandFilter,
                crossDomain: true,
                username: encodeURIComponent(appUser.username),
                password: encodeURIComponent(appUser.password),
                timeout: 0,
                dataType: 'json',
                contentType: "application/json; charset=utf-8"
            }).done(function (responseData, textStatus, jqXHR) {
                var newResponseData = responseData;
                //console.debug("lenght before " + responseData.d.results.length + " of " + newResponseData.d.__next);
                var bFoundToken = true;
                //check if serverside paging occured (see if there is a valid .__next proprety in data)
                if (newResponseData.d.__next) {

                    //receive skiptoken for paging
                    var turl = newResponseData.d.__next;
                    console.log(turl);
                    console.log("2nd attempt");

                    // request new results based on skiptoken parameter - > call them synchronous to stay in while loop
                    var jqXHR2 = $.ajax({
                        type: 'GET',
                        url: turl,
                        crossDomain: true,
                        username: encodeURIComponent(appUser.username),
                        password: encodeURIComponent(appUser.password),
                        timeout: 0,
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8"
                    }).done(function (responseDataSubQuery, textStatus, jqXHR2) {

                        //check i the new result also contains a skiptoken - > if so keep loop running
                        if (responseDataSubQuery.d.__next) {
                            //    console.debug("found new one" & responseDataSubQuery.d.__next);
                            bFoundToken = true;
                        } else {
                            bFoundToken = false;
                        }

                        //add new results to old response array
                        $.each(responseDataSubQuery.d.results, function (index, value) {
                            responseData.d.results.push(value);
                        });
                        //console.debug("lenght after " + responseData.d.results.length);

                        //overwrite New Reponsedata for next loop
                        newResponseData = null;
                        newResponseData = responseDataSubQuery;
                        turl = newResponseData.d.__next;
                        console.log(turl);

                        if (bFoundToken === true) {
                            console.log("3rd attempt");

                            // request new results based on skiptoken parameter - > call them synchronous to stay in while loop
                            var jqXHR3 = $.ajax({
                                type: 'GET',
                                url: turl,
                                crossDomain: true,
                                username: encodeURIComponent(appUser.username),
                                password: encodeURIComponent(appUser.password),
                                timeout: 0,
                                dataType: 'json',
                                contentType: "application/json; charset=utf-8"
                            }).done(function (responseDataSubQuery2, textStatus, jqXHR3) {
                                bFoundToken = false;

                                //check i the new result also contains a skiptoken - > if so keep loop running
                                if (responseDataSubQuery2.d.__next) {
                                    //    console.debug("found new one" & responseDataSubQuery.d.__next);
                                    bFoundToken = true;
                                } else {
                                    bFoundToken = false;
                                }

                                //add new results to old response array
                                $.each(responseDataSubQuery2.d.results, function (index, value) {
                                    responseData.d.results.push(value);
                                });

                                //console.debug("lenght after " + responseData.d.results.length);

                                //overwrite New Reponsedata for next loop
                                newResponseData = null;
                                newResponseData = responseDataSubQuery2;
                                turl = newResponseData.d.__next;
                                console.log(turl);

                                if (bFoundToken === true) {
                                    console.log("4th attempt");

                                    // request new results based on skiptoken parameter - > call them synchronous to stay in while loop
                                    var jqXHR4 = $.ajax({
                                        type: 'GET',
                                        url: turl,
                                        crossDomain: true,
                                        username: encodeURIComponent(appUser.username),
                                        password: encodeURIComponent(appUser.password),
                                        timeout: 0,
                                        dataType: 'json',
                                        contentType: "application/json; charset=utf-8"
                                    }).done(function (responseDataSubQuery3, textStatus, jqXHR3) {
                                        bFoundToken = false;

                                        //check i the new result also contains a skiptoken - > if so keep loop running
                                        if (responseDataSubQuery3.d.__next) {
                                            //    console.debug("found new one" & responseDataSubQuery.d.__next);
                                            bFoundToken = true;
                                        } else {
                                            bFoundToken = false;
                                        }

                                        //add new results to old response array
                                        $.each(responseDataSubQuery3.d.results, function (index, value) {
                                            responseData.d.results.push(value);
                                        });

                                        //console.debug("lenght after " + responseData.d.results.length);

                                        //overwrite New Reponsedata for next loop
                                        newResponseData = null;
                                        newResponseData = responseDataSubQuery3;
                                        turl = newResponseData.d.__next;
                                        console.log(turl);

                                        if (bFoundToken === true) {
                                            console.log("5th attempt");

                                            // request new results based on skiptoken parameter - > call them synchronous to stay in while loop
                                            var jqXHR5 = $.ajax({
                                                type: 'GET',
                                                url: turl,
                                                crossDomain: true,
                                                username: encodeURIComponent(appUser.username),
                                                password: encodeURIComponent(appUser.password),
                                                timeout: 0,
                                                dataType: 'json',
                                                contentType: "application/json; charset=utf-8"
                                            }).done(function (responseDataSubQuery4, textStatus, jqXHR5) {
                                                bFoundToken = false;

                                                //check i the new result also contains a skiptoken - > if so keep loop running
                                                if (responseDataSubQuery4.d.__next) {
                                                    //    console.debug("found new one" & responseDataSubQuery.d.__next);
                                                    bFoundToken = true;
                                                } else {
                                                    bFoundToken = false;
                                                }

                                                //add new results to old response array
                                                $.each(responseDataSubQuery4.d.results, function (index, value) {
                                                    responseData.d.results.push(value);
                                                });

                                                //console.debug("lenght after " + responseData.d.results.length);

                                                //overwrite New Reponsedata for next loop
                                                newResponseData = null;
                                                newResponseData = responseDataSubQuery4;
                                                turl = newResponseData.d.__next;
                                                console.log(turl);

                                                if (bFoundToken === true) {
                                                    console.log("6th attempt");

                                                    // request new results based on skiptoken parameter - > call them synchronous to stay in while loop
                                                    var jqXHR6 = $.ajax({
                                                        type: 'GET',
                                                        url: turl,
                                                        crossDomain: true,
                                                        username: encodeURIComponent(appUser.username),
                                                        password: encodeURIComponent(appUser.password),
                                                        timeout: 0,
                                                        dataType: 'json',
                                                        contentType: "application/json; charset=utf-8"
                                                    }).done(function (responseDataSubQuery5, textStatus, jqXHR6) {
                                                        bFoundToken = false;

                                                        //check i the new result also contains a skiptoken - > if so keep loop running
                                                        if (responseDataSubQuery5.d.__next) {
                                                            //    console.debug("found new one" & responseDataSubQuery.d.__next);
                                                            bFoundToken = true;
                                                        } else {
                                                            bFoundToken = false;
                                                        }

                                                        //add new results to old response array
                                                        $.each(responseDataSubQuery5.d.results, function (index, value) {
                                                            responseData.d.results.push(value);
                                                        });
                                                        //console.debug("lenght after " + responseData.d.results.length);

                                                        //overwrite New Reponsedata for next loop
                                                        newResponseData = null;
                                                        newResponseData = responseDataSubQuery5;
                                                        turl = newResponseData.d.__next;
                                                        console.log(turl);

                                                        if (bFoundToken === true) {
                                                            console.log("7th attempt");

                                                            // request new results based on skiptoken parameter - > call them synchronous to stay in while loop
                                                            var jqXHR7 = $.ajax({
                                                                type: 'GET',
                                                                url: turl,
                                                                crossDomain: true,
                                                                username: encodeURIComponent(appUser.username),
                                                                password: encodeURIComponent(appUser.password),
                                                                timeout: 0,
                                                                dataType: 'json',
                                                                contentType: "application/json; charset=utf-8"
                                                            }).done(function (responseDataSubQuery6, textStatus, jqXHR7) {
                                                                bFoundToken = false;

                                                                //check i the new result also contains a skiptoken - > if so keep loop running
                                                                if (responseDataSubQuery6.d.__next) {
                                                                    //    console.debug("found new one" & responseDataSubQuery.d.__next);
                                                                    bFoundToken = true;
                                                                } else {
                                                                    bFoundToken = false;
                                                                }

                                                                //add new results to old response array
                                                                $.each(responseDataSubQuery6.d.results, function (index, value) {
                                                                    responseData.d.results.push(value);
                                                                });

                                                                //console.debug("lenght after " + responseData.d.results.length);

                                                                //overwrite New Reponsedata for next loop
                                                                newResponseData = null;
                                                                newResponseData = responseDataSubQuery6;
                                                                turl = newResponseData.d.__next;
                                                                console.log(turl);

                                                                if (bFoundToken === true) {

                                                                    console.log("8th attempt");

                                                                    // request new results based on skiptoken parameter - > call them synchronous to stay in while loop
                                                                    var jqXHR8 = $.ajax({
                                                                        type: 'GET',
                                                                        url: turl,
                                                                        crossDomain: true,
                                                                        username: encodeURIComponent(appUser.username),
                                                                        password: encodeURIComponent(appUser.password),
                                                                        timeout: 0,
                                                                        dataType: 'json',
                                                                        contentType: "application/json; charset=utf-8"
                                                                    }).done(function (responseDataSubQuery7, textStatus, jqXHR8) {
                                                                        bFoundToken = false;

                                                                        //check i the new result also contains a skiptoken - > if so keep loop running
                                                                        if (responseDataSubQuery7.d.__next) {
                                                                            //    console.debug("found new one" & responseDataSubQuery.d.__next);
                                                                            bFoundToken = true;
                                                                        } else {
                                                                            bFoundToken = false;
                                                                        }

                                                                        //add new results to old response array
                                                                        $.each(responseDataSubQuery7.d.results, function (index, value) {
                                                                            responseData.d.results.push(value);
                                                                        });

                                                                        //console.debug("lenght after " + responseData.d.results.length);

                                                                        //overwrite New Reponsedata for next loop
                                                                        newResponseData = null;
                                                                        newResponseData = responseDataSubQuery7;
                                                                        turl = newResponseData.d.__next;
                                                                        console.log(turl);

                                                                        if (bFoundToken === true) {

                                                                            console.log("9th attempt");

                                                                            // request new results based on skiptoken parameter - > call them synchronous to stay in while loop
                                                                            var jqXHR9 = $.ajax({
                                                                                type: 'GET',
                                                                                url: turl,
                                                                                crossDomain: true,
                                                                                username: encodeURIComponent(appUser.username),
                                                                                password: encodeURIComponent(appUser.password),
                                                                                timeout: 0,
                                                                                dataType: 'json',
                                                                                contentType: "application/json; charset=utf-8"
                                                                            }).done(function (responseDataSubQuery8, textStatus, jqXHR9) {
                                                                                bFoundToken = false;

                                                                                //check i the new result also contains a skiptoken - > if so keep loop running
                                                                                if (responseDataSubQuery8.d.__next) {
                                                                                    //    console.debug("found new one" & responseDataSubQuery.d.__next);
                                                                                    bFoundToken = true;
                                                                                } else {
                                                                                    bFoundToken = false;
                                                                                }

                                                                                //add new results to old response array
                                                                                $.each(responseDataSubQuery8.d.results, function (index, value) {
                                                                                    responseData.d.results.push(value);
                                                                                });

                                                                                //console.debug("lenght after " + responseData.d.results.length);

                                                                                //overwrite New Reponsedata for next loop
                                                                                newResponseData = null;
                                                                                newResponseData = responseDataSubQuery8;
                                                                                turl = newResponseData.d.__next;
                                                                                console.log(turl);

                                                                                if (bFoundToken === true) {


                                                                                    console.log("10th attempt");

                                                                                    // request new results based on skiptoken parameter - > call them synchronous to stay in while loop
                                                                                    var jqXHR10 = $.ajax({
                                                                                        type: 'GET',
                                                                                        url: turl,
                                                                                        crossDomain: true,
                                                                                        username: encodeURIComponent(appUser.username),
                                                                                        password: encodeURIComponent(appUser.password),
                                                                                        timeout: 0,
                                                                                        dataType: 'json',
                                                                                        contentType: "application/json; charset=utf-8"
                                                                                    }).done(function (responseDataSubQuery9, textStatus, jqXHR10) {
                                                                                        bFoundToken = false;

                                                                                        //check i the new result also contains a skiptoken - > if so keep loop running
                                                                                        if (responseDataSubQuery9.d.__next) {
                                                                                            //    console.debug("found new one" & responseDataSubQuery.d.__next);
                                                                                            bFoundToken = true;
                                                                                        } else {
                                                                                            bFoundToken = false;
                                                                                        }

                                                                                        //add new results to old response array
                                                                                        $.each(responseDataSubQuery9.d.results, function (index, value) {
                                                                                            responseData.d.results.push(value);
                                                                                        });

                                                                                        //console.debug("lenght after " + responseData.d.results.length);

                                                                                        //overwrite New Reponsedata for next loop
                                                                                        newResponseData = null;
                                                                                        newResponseData = responseDataSubQuery9;
                                                                                        turl = newResponseData.d.__next;
                                                                                        console.log(turl);

                                                                                        if (bFoundToken === true) {

                                                                                            console.log("11th attempt");

                                                                                            // request new results based on skiptoken parameter - > call them synchronous to stay in while loop
                                                                                            var jqXHR11 = $.ajax({
                                                                                                type: 'GET',
                                                                                                url: turl,
                                                                                                crossDomain: true,
                                                                                                username: encodeURIComponent(appUser.username),
                                                                                                password: encodeURIComponent(appUser.password),
                                                                                                timeout: 0,
                                                                                                dataType: 'json',
                                                                                                contentType: "application/json; charset=utf-8"
                                                                                            }).done(function (responseDataSubQuery10, textStatus, jqXHR11) {
                                                                                                bFoundToken = false;

                                                                                                //check i the new result also contains a skiptoken - > if so keep loop running
                                                                                                if (responseDataSubQuery10.d.__next) {
                                                                                                    //    console.debug("found new one" & responseDataSubQuery.d.__next);
                                                                                                    bFoundToken = true;
                                                                                                } else {
                                                                                                    bFoundToken = false;
                                                                                                }

                                                                                                //add new results to old response array
                                                                                                $.each(responseDataSubQuery10.d.results, function (index, value) {
                                                                                                    responseData.d.results.push(value);
                                                                                                });

                                                                                                //console.debug("lenght after " + responseData.d.results.length);

                                                                                                //overwrite New Reponsedata for next loop
                                                                                                newResponseData = null;
                                                                                                newResponseData = responseDataSubQuery10;
                                                                                                turl = newResponseData.d.__next;
                                                                                                console.log(turl);

                                                                                                if (bFoundToken === true) {


                                                                                                    //add more or finally capsule it into a function




                                                                                                } else {
                                                                                                    callback(responseData, deleteItems);
                                                                                                }

                                                                                            });





                                                                                        } else {
                                                                                            callback(responseData, deleteItems);
                                                                                        }

                                                                                    });




                                                                                } else {
                                                                                    callback(responseData, deleteItems);
                                                                                }

                                                                            });






                                                                        } else {
                                                                            callback(responseData, deleteItems);

                                                                        }

                                                                    });






                                                                } else {
                                                                    callback(responseData, deleteItems);

                                                                }

                                                            });

                                                        } else {
                                                            callback(responseData, deleteItems);

                                                        }

                                                    });

                                                } else {
                                                    callback(responseData, deleteItems);

                                                }

                                            });

                                        } else {
                                            callback(responseData, deleteItems);

                                        }

                                    });

                                } else {
                                    callback(responseData, deleteItems);

                                }

                            });

                        } else {
                            callback(responseData, deleteItems);

                        }

                    }).fail(function (responseDataSubQuery, textStatus, errorThrown) {
                        alert("error:" + textStatus + errorThrown);
                        console.debug(responseDataSubQuery, textStatus, errorThrown);
                        bFoundToken = false;
                        //abort loop
                        newResponseData = null;
                        $('body').trigger('sync-error');

                        //if auth failed
                        if (responseData && responseData.status && responseData.status === 401) {
                            appUser.doLogout();
                        }

                    });

                } else {
                    callback(responseData, deleteItems);
                }

            }).fail(function (responseData, textStatus, errorThrown) {
                console.warn(responseData, textStatus, errorThrown);

                if (responseData && responseData.status && responseData.status === 500) {
                    console.log(bolLoadLookups);

                    if (bolLoadLookups && bolLoadLookups == true) {
                        console.log("retrying");
                        bolLoadLookups = false;
                        //get documents
                        SharePoint.sharePointRequest(listName, documentsModel.mapSharePointData, false);
                        return;
                    }

                } else {
                    $('body').trigger('sync-error');
                    //if auth failed
                    if (responseData && responseData.status && responseData.status === 401) {
                        appUser.doLogout();
                    }
                }
            });

        });

    },
};

var Sync = persistence.define('Sync', {
    syncType: "TEXT",
    syncDate: "DATE",
    userId: "INT"
});

Sync.index('syncType', {
    unique: true
});

var SyncModel = {
    addSync: function (type) {
        var syncItem = {
            syncType: (type) ? type : "ALL",
            syncDate: new Date()
        };
        console.log("Adding Synctype: " + type);
        Sync.all().filter("syncType", "=", type).destroyAll(function () {
            persistence.add(new Sync(syncItem));
            persistence.flush();
        });
    },

    getSyncDate: function (type, callback) {
        Sync.all().filter("syncType", "=", type).limit(1).list(function (res) {
            try {
                var syncDate;
                //console.log(res[0]);
                if (res.length && res[0]._data.syncDate) {
                    syncDate = utils.dateFormat(new Date(res[0]._data.syncDate), "d.m.y H:M");
                    callback(syncDate);
                } else {
                    callback(i18n.strings["na"]);
                }
            } catch (e) {
                callback(i18n.strings["na"]);
            }
        });
    },
    getSyncDateYDM: function (type, callback) {
        Sync.all().filter("syncType", "=", type).limit(1).list(function (res) {
            try {
                var syncDate;
                //console.log(res[0]);
                if (res.length && res[0]._data.syncDate) {
                    syncDate = utils.dateFormat(new Date(res[0]._data.syncDate), "y-m-d");
                    callback(syncDate);
                } else {
                    callback(i18n.strings["na"]);
                }
            } catch (e) {
                callback(i18n.strings["na"]);
            }
        });
    }
};
