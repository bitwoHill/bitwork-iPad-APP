var INFOTHEK_LIST = "Infothek";

//DB model
var Infothek = persistence.define('Infothek', {
    nodeId: "INT",
    title: "TEXT",
    path: "TEXT",
    isFolder: "BOOL",
    parentFolder: "TEXT",
    spModifiedDate: "DATE",
    localPath: "TEXT",
    localModifiedDate: "DATE"
});

Infothek.index('nodeId', { unique: true });
Infothek.textIndex('title');

var InfothekModel = {

    syncInfothek : function(){
        $('body').trigger('sync-start');

        SharePoint.sharePointRequest(INFOTHEK_LIST, InfothekModel.mapSharePointData);
    },

    mapSharePointData: function(data){
    
        var spData = data.d || false;
        //   Infothek.all().destroyAll(function (ele) {  // cant delete the whole list because of local path

        //create lookup Array with all IDs from SharePoint. This is used to compare the Local Document IDs to them on Sharepoint
        var lookupIDsSharePoint = {};
        for (var i = 0, len = spData.results.length; i < len; i++) {
            lookupIDsSharePoint[spData.results[i].ID] = spData.results[i];
        }
      
        //check wheter files need to be deleted
        //get all local files and check wheter its in the collection of the new SP files
        Infothek.all().list(null, function (results) {
            if (results.length) {
                $.each(results, function (index, value) {
                    //check if an object with the current ID exists. If Not delete it
                    if (!lookupIDsSharePoint[value._data.nodeId]) {
                        console.debug("lokales element wurde nicht mehr gefunden: ");
                        console.debug(value);

                        // delete local file from filesystem
                        try {
                            //request filesystem to delete files if not found on SP anymore
                            window.resolveLocalFileSystemURI(value.localPath, onSuccess, onError);

                            function onSuccess(fileEntry) {
                                fileEntry.remove();
                            }

                            function onError() {
                                console.debug('An error occured');
                                alert("Could not create Filesystem. No Files will be deleted");
                            }
                        } catch (e) {
                            console.debug('An error occured');
                            alert("Could not create Filesystem. No Files will be deleted");
                        }

                        // remove entity from persistence layer
                        persistence.remove(value);
                    }
                });
            }
        });



        //upate db to reflect the deleted items
        persistence.flush(
                function () {

        if(spData && spData.results.length){
            $.each(spData.results, function(index, value){
                var newItem = {
                    nodeId : value.ID,
                    title: value.Name
                };

                newItem.isFolder = (value.Inhaltstyp === "Ordner")? true : false;

                if(value.Pfad){
                    var tmpPath = (value.Pfad).split("/").slice(1);
                    if(tmpPath.length){
                        newItem.parentFolder = tmpPath[tmpPath.length-1];
                    }
                }

                if(!newItem.isFolder){
                    newItem.path = value.Pfad + "/" + value.Name;
                    if (value.Geändert) {
                        newItem.spModifiedDate = utils.parseSharePointDate(value.Geändert);
                    }
                    //TODO: replace with file upload
                    /*InfothekModel.downloadInfothekFile(newItem, index, spData.results.length, function(infothekItem, pos, length){
                        persistence.add(new Infothek(infothekItem));

                        persistence.flush(
                            function(){
                                if( pos+1 === length ){
                                    SyncModel.addSync(INFOTHEK_LIST);
                                    $('body').trigger('sync-end');
                                    $('body').trigger('infothek-sync-ready');
                                }
                            }
                        );
                    });*/
                }

                persistence.add(new Infothek(newItem));
            });

            persistence.flush(function(){
                SyncModel.addSync(INFOTHEK_LIST);
                $('body').trigger('sync-end');
                $('body').trigger('infothek-sync-ready');
            });

        }
                    //});
                });
    },

    downloadSharePointFiles: function () {
        Infothek.all().limit(5).filter("isFolder", "=", false)
            .list(null, function (results) {
                if (results.length) {
                    var queueProgress = {
                        qLength: results.length,
                        qIndex: 0,
                        qSuccess: 0,
                        qFail: 0
                    }

                    $('body').trigger('download-queue-started', queueProgress);

                    $.each(results, function(index, value){
                        var data = value._data,
                            downloadData = {
                                folderName: "Infothek",
                                fileName: data.title,
                                path: data.path
                            };
                        //check if the file needs to be downloaed (if no local modified date exists or the spmod date is newer then local
                        if (data.localModifiedDate) {
                    if (data.localModifiedDate === data.spModifiedDate)
                    {
                    alert("skip");
                queueProgress.qSuccess++;
                     return true; //skip
                   }
                   
                    }
                        
                       
                        $.downloadQueue(downloadData)
                            .done(
                            function(entrie){
                                queueProgress.qSuccess++;
                                results[index].localPath(entrie.fullPath);
                                //overwrite sync date with status of last sp modified date
                                //this isnt 100% accurate but it shouldnt matter. Downloading files does not refresh the infothek list.
                                //Hence the SP File could be newer and the local database would still have the old modified date. 
                                // but this really shouldnt matter. Worse thing that happens is one additional Download of the same file
                                results[index].localModifiedDate(results[index].spModifiedDate);
                                //console.log("cnt:" + index);
                                persistence.flush();
                            }
                        ).fail(
                            function(entrie){
                                queueProgress.qFail++;
                                //console.log("cnt f:" + index);
                            }
                        ).always(
                            function(){
                                queueProgress.qIndex = index + 1;
                                if(queueProgress.qIndex === queueProgress.qLength){
                                    $('body').trigger('download-queue-ended', queueProgress);
                                } else {
                                    $('body').trigger('download-queue-progress', queueProgress);
                                }
                            }
                        );
                        
                    });
                } else {
                    $('body').trigger('download-queue-ended', {
                        qLength: 1,
                        qIndex: 1,
                        qSuccess: 0,
                        qFail: 0
                    });
                }
            });
    },

    downloadInfothekFile : function(infothekItem, index, length, callback){
        //TODO: use download mechanism to save file in device storage
        //Download mechanism should update infothekItem.path after upload.

        //after download done use callback
        callback(infothekItem, index, length);
    },

    searchInfothek: function(key){
        var infothekSearch = $.Deferred();
        Infothek.search(key).list(function(res){
            infothekSearch.resolve(res);
        });

        return infothekSearch.promise();
    }
};