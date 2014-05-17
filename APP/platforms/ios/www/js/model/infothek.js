var INFOTHEK_LIST = "Infothek", localFileSystemRoot;

//DB model
var Infothek = persistence.define('Infothek', {
    nodeId : "INT",
    title : "TEXT",
    path : "TEXT",
    isFolder : "BOOL",
    parentFolder : "TEXT",
    spModifiedDate : "DATE",
    localPath : "TEXT",
    localModifiedDate : "DATE"
});

Infothek.index('nodeId', {
    unique : true
});

var InfothekModel = {

    syncInfothek : function() {
        $('body').trigger('sync-start');
        $('#msgInfothek').toggleClass('in');

        SharePoint.sharePointRequest(INFOTHEK_LIST, InfothekModel.mapSharePointData);
    },

    mapSharePointData : function(data) {
//persistence.debug = true;
    
       //SharePoint Item Array
        var spData = data.d;
        //create lookup Array with all SP Items stored by ID. This is used to compare the Local Document IDs to those on Sharepoint
        var lookupIDsSharePoint = {};
        //One specific SharePoint Item used for Adding to local DB
        var spItemAdd;

          //clear search index. its rebuild completly everytime items get added. we did not yet find a way to rebuild it partly
        utils.emptySearchIndex("Infothek");


        //For each SharePoint Resultitem- get all IDs which still exists on SP in order to delete local Documents not in this list.
        for (var i = 0, len = spData.results.length; i < len; i++) {
            //add element to Array of SPItems Indexed by ID
            spItemAdd = spData.results[i];
            lookupIDsSharePoint[spData.results[i].ID] = spData.results[i];
            //add all items => to create new items
          var newItem = {
                nodeId : spItemAdd.ID,
                title : spItemAdd.Name
            };

            newItem.isFolder = (spItemAdd.Inhaltstyp === "Ordner") ? true : false;

            if (spItemAdd.Pfad) {
                var tmpPath = (spItemAdd.Pfad).split("/").slice(1);
                if (tmpPath.length) {
                    newItem.parentFolder = tmpPath[tmpPath.length - 1];
                }
            }

            if (!newItem.isFolder) {
                newItem.path = spItemAdd.Pfad + "/" + spItemAdd.Name;
                if (spItemAdd.Geändert) {
                    newItem.spModifiedDate = utils.parseSharePointDate(spItemAdd.Geändert);
                }
            }

            persistence.add(new Infothek(newItem));

           // console.log("adding " + spItemAdd.ID);
        }

         //persist new items to DB
        persistence.flush(function() {
       
            console.log("done adding new");

            //iterate all local files. If Document in LookupID List update, else delete by SP Item
            Infothek.all().list(null, function(results) {
                if (results.length) {

                    $.each(results, function(index, value) {

                        //check if ID still exists on SharePoint
                        if (lookupIDsSharePoint[value._data.nodeId]) 
                        {
                            //update routine / Adding routine
                            //One specific SharePoint Item used for Updateing local DB
                            var spItem;
                            //get SP Item stored in Array by ID of current local Item
                            spItem = lookupIDsSharePoint[value._data.nodeId];
                            if (spItem) {
                                 if (spItem.Name)
                           value.title(spItem.Name);
                        else
                            value.title("");

                        if (spItem.Pfad)
                            value.path(spItem.Pfad + "/" + spItem.Name);
                        else
                            value.path("");

                        if (spItem.Geändert)
                            value.spModifiedDate(utils.parseSharePointDate(spItem.Geändert));
                            
                              //  console.log("updated item: " + value._data.nodeId);
                          
                            }
                              delete spItem;
                        } else//delete
                        {
                        //  console.debug("lokales element wurde nicht mehr gefunden und wird gelöscht: ");
                         //console.debug(value._data.nodeId);

                            // delete local file from filesystem
                            if (value.localPath) {
                                window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
                                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                                    localFileSystemRoot = fileSystem.root.fullPath;

                                    try {
                                        //request filesystem to delete files if not found on SP anymore

                                        window.resolveLocalFileSystemURI(localFileSystemRoot + "/Infothek/" + value.localPath, onSuccess, onError);

                                        function onSuccess(fileEntry) {
                                            fileEntry.remove();
                                            console.debug("deleted element");

                                        }

                                        function onError() {
                                            console.log('An error (on error) occured with the filesystem object');
                                            //  console.log(value);
                                            //alert("Could not create Filesystem. No Files will be deleted");
                                        }

                                    } catch (e) {
                                        console.log('An error (exception) occured with the filesystem object');
                                        //        console.log(value);
                                        console.log(e);

                                    }
                                });
                            }
     // remove entity from persistence layer
                            persistence.remove(value);
                        }
                    });
                }
 console.log("done overwriting");

        persistence.flush(function() {
            console.log("done flushing");

           SyncModel.addSync(INFOTHEK_LIST);
                $('body').trigger('sync-end');
                $('body').trigger('infothek-sync-ready');
                $('#msgInfothek').removeClass('in');

        });
        delete lookupIDsSharePoint;
        delete spItemAdd;
        });
            });
 

      
    },



     


     mapSharePointData2 : function(data) {
//persistence.debug = true;
        var spData = data.d || false;
        //   Infothek.all().destroyAll(function (ele) {  // cant delete the whole list because of local path

        //clear search index. its rebuild completly everytime items get added. we did not yet find a way to rebuild it partly
        utils.emptySearchIndex("Infothek");

        //create lookup Array with all IDs from SharePoint. This is used to compare the Local Document IDs to them on Sharepoint
        var lookupIDsSharePoint = {};
        var spItem;

        for (var i = 0, len = spData.results.length; i < len; i++) {
            lookupIDsSharePoint[spData.results[i].ID] = spData.results[i];

            //overwrite Item for easier use
            spItem = spData.results[i];

            var newItem = {
                nodeId : spItem.ID,
                title : spItem.Name
            };

            newItem.isFolder = (spItem.Inhaltstyp === "Ordner") ? true : false;

            if (spItem.Pfad) {
                var tmpPath = (spItem.Pfad).split("/").slice(1);
                if (tmpPath.length) {
                    newItem.parentFolder = tmpPath[tmpPath.length - 1];
                }
            }

            if (!newItem.isFolder) {
                newItem.path = spItem.Pfad + "/" + spItem.Name;
                if (spItem.Geändert) {
                    newItem.spModifiedDate = utils.parseSharePointDate(spItem.Geändert);
                }

            }

            persistence.add(new Infothek(newItem));

            //filter Database based on ID of SP Item
            Infothek.findBy("nodeId", spItem.ID, function(item) {
                //If item not found add new, else update
                if (!item) {
                    //  console.log("Adding item");

                    //add to persistence instance
                    //   persistence.add(new Documents(doc));

                } else {//update Item

                    //because of threading and instancing we now need to get the SP Item back
                    //=> Grep gets data based on the function where the ID matches our current DB ID
                    var resultSPList = $.grep(spData.results, function(e) {
                        return e.ID === item._data.nodeId;
                    });
                    //&& utils.parseSharePointDate(e.Geändert) > item._data.spModifiedDate

                    //Grep gets a result set. but all we need is one item. we get the first (this should also be the only result!!)
                    var resultSP = resultSPList[0];

                    if (resultSP) {
                     //   console.log("Updating Item");
                        if (resultSP.Name)
                            item.title(resultSP.Name);
                        else
                            item.title("");

                        if (resultSP.Pfad)
                            item.path(resultSP.Pfad + "/" + resultSP.Name);
                        else
                            item.path("");

                        if (resultSP.Geändert)
                            item.spModifiedDate(utils.parseSharePointDate(resultSP.Geändert));

 delete resultSPList;
 delete resultSP;
                    }

                }

            });
        }

        console.log("done overwriting");

        //upate db to reflect the deleted items
        persistence.flush(function() {
            //check wheter files need to be deleted
            //get all local files and check wheter its in the collection of the new SP files
            Infothek.all().list(null, function(results) {
                if (results.length) {
                    $.each(results, function(index, value) {
                        //check if an object with the current ID exists. If Not delete it
                        if (!lookupIDsSharePoint[value._data.nodeId]) {
                            console.debug("lokales element wurde nicht mehr gefunden und wird gelöscht: ");
                            console.debug(value);

                            // delete local file from filesystem
                            if (value.localPath) {

                                window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

                                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                                    localFileSystemRoot = fileSystem.root.fullPath;

                                    try {
                                        //request filesystem to delete files if not found on SP anymore

                                        window.resolveLocalFileSystemURI(localFileSystemRoot + "/Infothek/" + value.localPath, onSuccess, onError);

                                        function onSuccess(fileEntry) {
                                            fileEntry.remove();
                                            console.debug("deleted element");

                                        }

                                        function onError() {
                                            console.log('An error (on error) occured with the filesystem object');
                                            //  console.log(value);
                                            //alert("Could not create Filesystem. No Files will be deleted");
                                        }

                                    } catch (e) {
                                        console.log('An error (exception) occured with the filesystem object');
                                        //        console.log(value);
                                        console.log(e);

                                    }
                                });

                            }

                            // remove entity from persistence layer
                            persistence.remove(value);

                        }
                    });
                }

            console.log("done overwriting");

            persistence.flush(function() {
                console.log("done flushing");
                SyncModel.addSync(INFOTHEK_LIST);
                $('body').trigger('sync-end');
                $('body').trigger('infothek-sync-ready');
                $('#msgInfothek').removeClass('in');

            });
delete spData;
delete lookupIDsSharePoint;
delete spItem;
       });
            });
 

      
    },


    downloadSharePointFiles : function() {
        //search only files in infothek
        Infothek.all().filter("isFolder", "=", false).list(null, function(results) {
            if (results.length) {
                var queueProgress = {
                    qLength : results.length,
                    qIndex : 0,
                    qSuccess : 0,
                    qFail : 0
                };

                $('body').trigger('download-queue-started', queueProgress);

                $.each(results, function(index, value) {
                    var data = value._data, downloadData = {
                        folderName : "Infothek",
                        fileName : data.title,
                        path : data.path
                    };

                    //console.debug(results);
                    //console.debug(results[1]);
                    //console.debug(results[1]._data.localModifiedDate);

                    //check if the file needs to be downloaed (if no local modified date exists or the spmod date is newer then local
                    //alert(data.localModifiedDate);
                    //alert(data.spModifiedDate);

                    if (data.localModifiedDate) {

                        if (data.localModifiedDate.getTime() === data.spModifiedDate.getTime()) {
                            console.debug("skiped " + data.title);
                            queueProgress.qSuccess++;

                            //trigger event, as if downloaded
                            queueProgress.qIndex = index + 1;
                            if (queueProgress.qIndex === queueProgress.qLength) {
                                $('body').trigger('download-queue-ended', queueProgress);
                            } else {
                                $('body').trigger('download-queue-progress', queueProgress);
                            }
                            return true;
                            //skip download
                        }
                    }

                    $.downloadQueue(downloadData).done(function(entrie) {
                        queueProgress.qSuccess++;
                        //  console.debug(entrie);
                        //   results[index].localPath(entrie.fullPath);
                        results[index].localPath(entrie.name);
                        //overwrite sync date with status of last sp modified date
                        //this isnt 100% accurate but it shouldnt matter. Downloading files does not refresh the infothek list.
                        //Hence the SP File could be newer and the local database would still have the old modified date.
                        // but this really shouldnt matter. Worse thing that happens is one additional Download of the same file
                        results[index].localModifiedDate(results[index]._data.spModifiedDate);
                        //console.log("cnt:" + index);
                        persistence.flush();
                    }).fail(function(entrie) {
                        queueProgress.qFail++;
                        //console.log("cnt f:" + index);
                    }).always(function() {
                        queueProgress.qIndex = index + 1;
                        if (queueProgress.qIndex === queueProgress.qLength) {
                            $('body').trigger('download-queue-ended', queueProgress);
                        } else {
                            $('body').trigger('download-queue-progress', queueProgress);
                        }
                    });
                });
            } else {
                $('body').trigger('download-queue-ended', {
                    qLength : 1,
                    qIndex : 1,
                    qSuccess : 0,
                    qFail : 0
                });
            }
        });
    },

    searchInfothek : function(key) {

        var infothekSearch = $.Deferred();
        key = "%" + key.replace("*", "") + "%";
        key = key.replace(/ /g, '%');
        //replace changes only first instance . thats why the global modifier "g" of a regular expression was used. find all whitepaces and change to %

        Infothek.all().filter("title", "LIKE", key).and(new persistence.PropertyFilter("isFolder", "=", false)).order('title', true, false).list(function(res) {

            infothekSearch.resolve(res);
        });

        return infothekSearch.promise();
    }
}; 