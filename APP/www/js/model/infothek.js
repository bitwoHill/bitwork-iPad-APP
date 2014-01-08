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

var InfothekModel = {

    syncInfothek: function () {
        $('body').trigger('sync-start');

        SharePoint.sharePointRequest(INFOTHEK_LIST, InfothekModel.mapSharePointData);
    },

    mapSharePointData: function (data) {

        var spData = data.d || false;
        //   Infothek.all().destroyAll(function (ele) {  // cant delete the whole list because of local path

        //clear search index. its rebuild completly everytime items get added. we did not yet find a way to rebuild it partly
        utils.emptySearchIndex("Infothek");


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
                        console.debug("lokales element wurde nicht mehr gefunden und wird gelöscht: ");
                        console.debug(value);

                        // delete local file from filesystem
                        try {
                            //request filesystem to delete files if not found on SP anymore
                            window.resolveLocalFileSystemURI(value.localPath, onSuccess, onError);

                            function onSuccess(fileEntry) {
                                fileEntry.remove();
                                console.debug("deleted element");

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

        console.debug("Cleaned local files");

        //upate db to reflect the deleted items
        persistence.flush(
                function () {

                    if (spData && spData.results.length) {
                        //add new elements
                        $.each(spData.results, function (index, value) {
                            var newItem = {
                                nodeId: value.ID,
                                title: value.Name
                            };

                            newItem.isFolder = (value.Inhaltstyp === "Ordner") ? true : false;

                            if (value.Pfad) {
                                var tmpPath = (value.Pfad).split("/").slice(1);
                                if (tmpPath.length) {
                                    newItem.parentFolder = tmpPath[tmpPath.length - 1];
                                }
                            }

                            if (!newItem.isFolder) {
                                newItem.path = value.Pfad + "/" + value.Name;
                                if (value.Geändert) {
                                    newItem.spModifiedDate = utils.parseSharePointDate(value.Geändert);
                                }

                            }

                            persistence.add(new Infothek(newItem));
                        });

                        persistence.flush(function () {
                            SyncModel.addSync(INFOTHEK_LIST);
                            $('body').trigger('sync-end');
                            $('body').trigger('infothek-sync-ready');
                        });

                    }
                    //});
                });
    },

    downloadSharePointFiles: function () {
        //search only files in infothek
        Infothek.all().limit(10).filter("isFolder", "=", false)
            .list(null, function (results) {
                if (results.length) {
                    var queueProgress = {
                        qLength: results.length,
                        qIndex: 0,
                        qSuccess: 0,
                        qFail: 0
                    }

                    $('body').trigger('download-queue-started', queueProgress);

                    $.each(results, function (index, value) {
                        var data = value._data,
                            downloadData = {
                                folderName: "Infothek",
                                fileName: data.title,
                                path: data.path
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
                                return true; //skip download
                            }
                        }



                        $.downloadQueue(downloadData)
                            .done(
                            function (entrie) {
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
                            }
                        ).fail(
                            function (entrie) {
                                queueProgress.qFail++;
                                //console.log("cnt f:" + index);
                            }
                        ).always(
                            function () {
                                queueProgress.qIndex = index + 1;
                                if (queueProgress.qIndex === queueProgress.qLength) {
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

    searchInfothek: function (key) {

        var infothekSearch = $.Deferred();
        key = "%" + key.replace("*", "") + "%";
        key = key.replace(/ /g, '%'); //replace changes only first instance . thats why the global modifier "g" of a regular expression was used. find all whitepaces and change to %


        Infothek.all().filter("title", "LIKE", key).and(new persistence.PropertyFilter("isFolder", "=", false)).list(function (res) {
            infothekSearch.resolve(res);
        });

        return infothekSearch.promise();
    }
};