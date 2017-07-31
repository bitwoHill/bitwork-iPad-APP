var SharePoint = {

    sleep: function (milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    },
    getNextBatch: function (listName, ExpandFilter, deleteItems, totalSoFar, completeData, onCompleteCallback) {
        try {
            $('body').trigger('sync-start');
        } catch (error) {

        }

        var tUrl = "";
        tUrl = Settings.spDomain + "/" + listName + "?$orderby=ID&$skip=" + totalSoFar + "&$top=1000";
        tUrl = tUrl + ExpandFilter;

        console.log(tUrl);
        console.log(listName + " Total: " + totalSoFar);

        if (listName == "Dokumente") {
            console.log("sleeping");
            SharePoint.sleep(300);
            console.log("resumeing");
            tUrl = Settings.spDomain + "/" + listName + "?$orderby=ID&$skip=" + totalSoFar + "&$top=800";
            tUrl = tUrl + ExpandFilter;
        }
        try {
            var jqXHR = $.ajax({
                type: 'GET',
                url: tUrl,
                crossDomain: true,
                username: encodeURIComponent(appUser.username),
                password: encodeURIComponent(appUser.password),
                timeout: 0,
                dataType: 'json',
                contentType: "application/json; charset=utf-8"
            }).done(function (responseData, textStatus, jqXHR) {
                //  console.log(responseData);
                // console.log(responseData.d.length);


                var count = responseData.d.length;

                if (responseData.d.results)
                    count = responseData.d.results.length;
                if (count > 0) {


                    if (responseData.d.results)
                        $.each(responseData.d.results, function (index, value) {
                            completeData.d.results.push(value);
                        });
                    else
                        $.each(responseData.d, function (index, value) {
                            completeData.d.results.push(value);
                        });


                    SharePoint.getNextBatch(listName, ExpandFilter, deleteItems, totalSoFar + count, completeData, onCompleteCallback); // fetch next page
                } else {
                    console.log(listName + " finished Total: " + completeData.d.results.length);
                    // console.log(completeData);
                    try {
                        $('body').trigger('sync-end');

                    } catch (error) {

                    }
                    onCompleteCallback(completeData, deleteItems);

                }

            }).fail(function (x, t, m) {
                if (t === "timeout") {
                    alert("got timeout");
                } else {
                    alert(t);
                }
            }
                );
        } catch (error) {
            alert("error");
        }
    },
    sharePointRequest: function (listName, callback, bolLoadLookups, dateFilter) {

        //get latest sync date
        //filter Database based on ID of SP Item

        //  console.log("List: " + listName);
        //  if (listName === "Dokumente" || listName === "Infothek")
        //{
        // DateFilter1 = "/?$filter=Geändert%20ge%20datetime%27" + FilterDate + "%27";
        //console.log("finished filter:" + DateFilter1);
        //};
        //see if sharepoint Paging is intact if so - recursive call

        SyncModel.getSyncDateYDM(listName, function (FilterDate) {

            //Filter needs to be expanded in order to get multilookup values
            var ExpandFilter = "";
            var deleteItems = true;
            if (bolLoadLookups && bolLoadLookups == true) {


                if (listName == "Infothek") {
                    if (dateFilter) {
                        ExpandFilter = "&$filter=Geändert%20ge%20datetime%27" + dateFilter + "%27";
                        deleteItems = false; // bei dem sync (fast sync) werden nur die aktuellsten elemente geladen. deswegen muss im callback das löschen der elemente unterbunden werden, die nicht vom SP zurück gekommen sind
                    }
                }
                if (listName == "Dokumenttypen")
                    deleteItems = false; // bei dem sync (fast sync) werden nur die aktuellsten elemente geladen. deswegen muss im callback das löschen der elemente unterbunden werden, die nicht vom SP zurück gekommen sind                    


                if (listName == "Dokumente") {
                    ExpandFilter = "&$select=ID,Name,DokumenttypId,Pfad,Geändert,Produktgruppe/ID,Produktfamilie/ID,Produktplattform/ID,Produkt/ID,Equipment/ID&$expand=Equipment,Produktgruppe,Produktfamilie,Produktplattform,Produkt";
                    if (dateFilter) {
                        ExpandFilter += "&$filter=Geändert%20ge%20datetime%27" + dateFilter + "%27";
                        deleteItems = false; // bei dem sync (fast sync) werden nur die aktuellsten elemente geladen. deswegen muss im callback das löschen der elemente unterbunden werden, die nicht vom SP zurück gekommen sind                    
                    }
                }
                if (listName == "ProduktbezeichnungOptionen")
                    ExpandFilter = "&$select=*,Produktgruppe/ID,Produktfamilie/ID,Produktplattform/ID,Produkt/ID,ProduktbezeichnungEquipment/ID&$expand=ProduktbezeichnungEquipment,Produktgruppe,Produktfamilie,Produktplattform,Produkt";
            }
            //   console.log(Settings.spDomain + "/" + listName + ExpandFilter + "?$orderby=ID&$top=100");
            var tUrl = "";
            tUrl = Settings.spDomain + "/" + listName + "?$orderby=ID&$top=1000";
            tUrl = tUrl + ExpandFilter;

            console.log(tUrl);

            var jqXHR = $.ajax({
                type: 'GET',
                url: tUrl,
                crossDomain: true,
                username: encodeURIComponent(appUser.username),
                password: encodeURIComponent(appUser.password),
                timeout: 0,
                dataType: 'json',
                contentType: "application/json; charset=utf-8"
            }).done(function (responseData, textStatus, jqXHR) {
                var completeData = {
                    d: {
                        results: []
                    }
                };
                //  console.log("first result of " + listName);
                // console.log(responseData);

                if (responseData.d.results)
                    $.each(responseData.d.results, function (index, value) {
                        completeData.d.results.push(value);
                    });
                else
                    $.each(responseData.d, function (index, value) {
                        completeData.d.results.push(value);
                    });


                //  console.log(responseData);
                // console.log(completeData);
                //console.log(responseData.d);
                //console.log(responseData.d.length);

                var count = completeData.d.results.length;
                SharePoint.getNextBatch(listName, ExpandFilter, deleteItems, count, completeData, callback); // fetch next page 
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
    }
}






var Sync = persistence.define('Sync', {
    syncType: "TEXT",
    syncDate: "DATE",
    syncCounter: "INT",
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

        SyncModel.getSyncCounter(type, function (Counter) {
            var syncCounter = 1;
            if (Counter !== undefined)
                syncCounter = Counter + 1;
                console.log("new synccounter for " + type + " " + syncCounter);
            syncItem.syncCounter = syncCounter;

            if (syncCounter > 11)
            {
                  console.log("reset synccounter for " + type );
            syncItem.syncCounter = 1;
            }
        });




        // try {
        //     if (type == "Dokumente") {

        //         var queryLatestItem = Documents.all().order("spModifiedDate", false).limit(1);

        //         queryLatestItem.list(null, function (results) {

        //             if (results.length !== 0) {
        //                 results.forEach(function (r) {
        //                     var latestItem = r
        //                     var latestDate = latestItem.spModifiedDate();
        //                     if (latestDate) {
        //                         console.log("SyncDate by SP Modified Date")
        //                         syncItem.syncDate = latestDate
        //                     }
        //                 });

        //             };
        //         });

        //     }
        // } catch (error) {

        // }
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
    getSyncCounter: function (type, callback) {
        Sync.all().filter("syncType", "=", type).limit(1).list(function (res) {
            try {
                var syncCounter;
                if (res.length && res[0]._data.syncCounter) {
                    syncCounter = res[0]._data.syncCounter;
                    callback(syncCounter);
                } else {
                    callback(1);
                }
            } catch (e) {
                callback(1);
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
