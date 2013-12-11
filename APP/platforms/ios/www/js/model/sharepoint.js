var SharePoint = {

    sharePointRequest: function (listName, callback) {

        //see if sharepoint Paging is intact if so - recursive call
        var jqXHR = $.ajax({
            type: 'GET',
            url: Settings.spDomain + "/" + listName,
            crossDomain: true,
            username: appUser.username,
            password: appUser.password,
            dataType: 'json'
        }).done(function (responseData, textStatus, jqXHR) {
            var newResponseData = responseData;

            //check if serverside paging occurd (see if there is a valid .__next proprety in data)
            if (newResponseData.d.__next) {
                //console.debug("lenght before " + responseData.d.results.length + " of " + newResponseData.d.__next);
                var bFoundToken = true;

                while (bFoundToken === true) {
                    //receive skiptoken for paging
                    var url = newResponseData.d.__next;
                    //split the url vor only the skiptoken parameter       
                    var tmp = url.split("?")
                    //get the last token
                    var newone = tmp[tmp.length - 1];
                  
                   // request new results based on skiptoken parameter - > call them synchronous to stay in while loop
                    var jqXHR2 = $.ajax({
                        type: 'GET',
                        url: Settings.spDomain + "/" + listName + "/?" + newone,
                        crossDomain: true,
                        username: appUser.username,
                        password: appUser.password,
                        dataType: 'json',
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
                        if(responseData && responseData.status && responseData.status === 401){
                            appUser.doLogout();
                        }
                    })
                }

            }

            callback(responseData);
        }).fail(
            function (responseData, textStatus, errorThrown) {
                console.warn(responseData, textStatus, errorThrown);
                $('body').trigger('sync-error');
                //if auth failed
                if(responseData && responseData.status && responseData.status === 401){
                    appUser.doLogout();
                }
            }
        );


    },


    //did not work as expected
    //sharePointChangesRequest: function (listName,sincedate) {

        
    //    var soapRequest = '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">  <soap:Body> <GetListItemChanges xmlns="http://schemas.microsoft.com/sharepoint/soap/"> <listName>' + listName + '</listName>  <since>' + sincedate + ' </since>      </GetListItemChanges>  </soap:Body> </soap:Envelope>';

    //    jQuery.support.cors = true;
    //    console.debug(soapRequest);
    
    //    var jqXHR = $.ajax({
    //        type: 'POST',
    //        url: Settings.spListsWebservice,
    //        crossDomain: true,
    //        username: appUser.username,
    //        password: appUser.password,
    //        contentType: 'text/xml; charset="UTF-8"',
    //        data: soapRequest,
    //        dataType: 'xml'
    //    }).done(function (responseData, textStatus, jqXHR) {
    //        console.debug(responseData);
    //            jQuery.support.cors = false;
    //    }).fail(
    //        function (responseData, textStatus, errorThrown) {
    //            console.warn(responseData, textStatus, errorThrown);
    //            $('body').trigger('sync-error');
    //            jQuery.support.cors = false;

    //            //if auth failed
    //            if (responseData && responseData.status && responseData.status === 401) {
    //                appUser.doLogout();
    //            }
    //        }
    //    );


    //}
};

var Sync = persistence.define('Sync', {
    syncType: "TEXT",
    syncDate: "DATE",
    userId: "INT"
});

Sync.index('syncType', { unique: true });

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

        Sync.all().filter("syncType", "=", type).destroyAll(function () {
            persistence.add(new Sync(syncItem));
            persistence.flush();
        });
    },

    getSyncDate: function (type, callback) {
        Sync.all().filter("syncType", "=", type).limit(1).list(function (res) {
            try{
                var syncDate;
                //console.log(res[0]);
                if (res.length && res[0]._data.syncDate) {
                    syncDate = utils.dateFormat(new Date(res[0]._data.syncDate), "m.d.y H:M");
                    callback(syncDate);
                } else {
                    callback(i18n.strings["na"]);
                }
            }
            catch (e)
            {
                callback(i18n.strings["na"]);
            }
        });
    }
};