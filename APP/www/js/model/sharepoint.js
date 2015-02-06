var SharePoint = {

    sharePointRequest: function (listName, callback, bolLoadLookups) {
        var DateFilter1 = "", DateFilter2 = "";
          //get latest sync date

     
    //console.log("Build Date Filter");
 //filter Database based on ID of SP Item
SyncModel.getSyncDateYDM(listName, function(FilterDate)
{
  //  console.log("List: " + listName);
  //  if (listName === "Dokumente" || listName === "Infothek")
//{
 // DateFilter1 = "/?$filter=Geändert%20ge%20datetime%27" + FilterDate + "%27";
//console.log("finished filter:" + DateFilter1);
//};
 //see if sharepoint Paging is intact if so - recursive call

 //Filter needs to be expanded in order to get multilookup values
 var ExpandFilter = "";
 if (bolLoadLookups && bolLoadLookups == true) {
    console.log("bolLoadLookups");
    console.log(bolLoadLookups);
    console.log("listName");
    console.log(listName);

    if (listName == "Dokumente") 
 ExpandFilter = "?$expand=Equipment,Produktgruppe,Produktfamilie,Produktplattform,Produkt&$select=*,Produktgruppe/ID,Produktfamilie/ID,Produktplattform/ID,Produkt/ID,Equipment/ID";

if ( listName == "ProduktbezeichnungOptionen") 
    ExpandFilter = "?$expand=ProduktbezeichnungEquipment,Produktgruppe,Produktfamilie,Produktplattform,Produkt&$select=*,Produktgruppe/ID,Produktfamilie/ID,Produktplattform/ID,Produkt/ID,ProduktbezeichnungEquipment/ID";
 }

 console.log("ExpandFilter");
 console.log(ExpandFilter);




        var jqXHR = $.ajax({
            type: 'GET',
            url: Settings.spDomain + "/" + listName + ExpandFilter,
            crossDomain: true,
            username: encodeURIComponent(appUser.username),
            password: encodeURIComponent(appUser.password),
            dataType: 'json',
               contentType: "application/json; charset=utf-8"
        }).done(function (responseData, textStatus, jqXHR) {
            var newResponseData = responseData;

            //check if serverside paging occurd (see if there is a valid .__next proprety in data)
            if (newResponseData.d.__next) {
                //console.debug("lenght before " + responseData.d.results.length + " of " + newResponseData.d.__next);
                var bFoundToken = true;

                while (bFoundToken === true) {

                    //receive skiptoken for paging
                    var turl = newResponseData.d.__next;
                    console.log(turl);
               
                    // request new results based on skiptoken parameter - > call them synchronous to stay in while loop
                    var jqXHR2 = $.ajax({
                        type: 'GET',
                        url: turl,
                        crossDomain: true,
                        username: encodeURIComponent(appUser.username),
                        password: encodeURIComponent(appUser.password),
                        dataType: 'json',
                          contentType: "application/json; charset=utf-8",
                        async: false
                    }).done(function (responseDataSubQuery, textStatus, jqXHR2) {

                        //check i the new result also contains a skiptoken - > if so keep loop running
                        if (responseDataSubQuery.d.__next) {
                            //    console.debug("found new one" & responseDataSubQuery.d.__next);
                            bFoundToken = true;
                        }
                        else {
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

                    }).fail(function (responseDataSubQuery, textStatus, errorThrown) {
                        console.debug(responseDataSubQuery, textStatus, errorThrown);
                        bFoundToken = false; //abort loop
                        newResponseData = null;
                        $('body').trigger('sync-error');

                        //if auth failed
                        if (responseData && responseData.status && responseData.status === 401) {
                            appUser.doLogout();
                        }
                      
                    });
                }

            }

            callback(responseData);
        }).fail(
            function (responseData, textStatus, errorThrown) {
                console.warn(responseData, textStatus, errorThrown);

                  if (responseData && responseData.status && responseData.status === 500) {
                    console.log(bolLoadLookups);

                            if (bolLoadLookups && bolLoadLookups == true)
                                {
                                       console.log("retrying");
                                       bolLoadLookups = false;
                            //get documents
                SharePoint.sharePointRequest(listName, documentsModel.mapSharePointData,false);
                return;
                                }
                                    
                        }
                        else{
                $('body').trigger('sync-error');
                //if auth failed
                if (responseData && responseData.status && responseData.status === 401) {
                    appUser.doLogout();
                }
                }
            }
        );


});

















    },


};

var Sync = persistence.define('Sync', {
    syncType: "TEXT",
    syncDate: "DATE",
    userId: "INT"
});

Sync.index('syncType', { unique: true });


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
            }
            catch (e) {
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
            }
            catch (e) {
                callback(i18n.strings["na"]);
            }
        });
    }
};