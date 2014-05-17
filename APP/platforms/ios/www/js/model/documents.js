var DOCUMENTS_LIST = "Dokumente", DOCUMENTTYPES_LIST = "Dokumenttypen", localFileSystemRoot;
//these documents and documenttypes are used in MPlstammdaten.js

//in this case the foreignkeys are Text, because there can be a relation to several items
var Documents = persistence.define('Documents', {
    documentId : "INT",
    documentname : "TEXT",
    documenttypeFK : "INT",
    path : "TEXT",
    productgroupFK : "INT",
    productfamilyFK : "INT",
    productplatformFK : "INT",
    productFK : "INT",
    equipmentFK : "INT",
    spModifiedDate : "DATE",
    localPath : "TEXT",
    localModifiedDate : "DATE"
});

Documents.index(['documentId'], {
    unique : true
});

//Documenttypes
var Documenttypes = persistence.define('Documenttypes', {
    documenttypeId : "INT",
    name : "TEXT"
});
Documenttypes.index(['documenttypeId'], {
    unique : true
});

//create mock data for Documents and Documenttypes
var documentsModel = {
    sharePointDocuments : function() {
        //get documenttypes
        //  $('body').trigger('sync-start');
        $('#msgDocuments').toggleClass('in');

        SharePoint.sharePointRequest(DOCUMENTTYPES_LIST, documentsModel.mapSharePointDataDocumentTypes);
    },
    //maps SharePoint data to current model
    mapSharePointDataDocumentTypes : function(data) {
        var spData = data.d;
        Documenttypes.all().destroyAll(function(ele) {// cant delete the whole list because of local path

            if (spData && spData.results.length) {
                $.each(spData.results, function(index, value) {
                    var documenttypeItem = {
                        documenttypeId : value.ID,
                        name : (value.Dokumenttyp) ? value.Dokumenttyp : ""
                    };

                    persistence.add(new Documenttypes(documenttypeItem));

                });

                persistence.flush(function() {
                    SyncModel.addSync(DOCUMENTTYPES_LIST);
                    //get documents

                    SharePoint.sharePointRequest(DOCUMENTS_LIST, documentsModel.mapSharePointData);
                });

            } else {
                //get documents
                SharePoint.sharePointRequest(DOCUMENTS_LIST, documentsModel.mapSharePointData);
            }

        });
        delete spData;

    },
    //maps SharePoint data to current model
    mapSharePointData : function(data) {
        //SharePoint Item Array
        var spData = data.d;
        //create lookup Array with all SP Items stored by ID. This is used to compare the Local Document IDs to those on Sharepoint
        var lookupIDsSharePoint = {};
        //One specific SharePoint Item used for Adding to local DB
        var spItemAdd;

        //For each SharePoint Resultitem- get all IDs which still exists on SP in order to delete local Documents not in this list.
        for (var i = 0, len = spData.results.length; i < len; i++) {
            //add element to Array of SPItems Indexed by ID
            spItemAdd = spData.results[i];
            lookupIDsSharePoint[spData.results[i].ID] = spData.results[i];
            //add all items => to create new items
            var doc = {
                documentId : spItemAdd.ID,
                documentname : (spItemAdd.Name) ? spItemAdd.Name : "",
                documenttypeFK : (spItemAdd.DokumenttypId) ? spItemAdd.DokumenttypId : "",
                path : (spItemAdd.Pfad) ? spItemAdd.Pfad + "/" + spItemAdd.Name : "",
                productgroupFK : (spItemAdd.ProduktgruppeId) ? spItemAdd.ProduktgruppeId : "",
                productfamilyFK : (spItemAdd.ProduktfamilieId) ? spItemAdd.ProduktfamilieId : "",
                productplatformFK : (spItemAdd.ProduktplattformId) ? spItemAdd.ProduktplattformId : "",
                productFK : (spItemAdd.ProduktId) ? spItemAdd.ProduktId : "",
                equipmentFK : (spItemAdd.EquipmentId) ? spItemAdd.EquipmentId : ""
            };
            //Parse modified date

            if (spItemAdd.Geändert) {
                doc.spModifiedDate = utils.parseSharePointDate(spItemAdd.Geändert);
            }
            //add to persistence instance
            persistence.add(new Documents(doc));

          //  console.log("adding " + spItemAdd.ID);
        }

        //persist new items to DB
        persistence.flush(function() {
          
            console.log("done adding new");

            //iterate all local files. If Document in LookupID List update, else delete by SP Item
            Documents.all().list(null, function(results) {
                if (results.length) {

                    $.each(results, function(index, value) {

                        //check if ID still exists on SharePoint
                        if (lookupIDsSharePoint[value._data.documentId]) {
                            //update routine / Adding routine
                            //One specific SharePoint Item used for Updateing local DB
                            var spItem;
                            //get SP Item stored in Array by ID of current local Item
                            spItem = lookupIDsSharePoint[value._data.documentId];
                            if (spItem) {
                                //  console.log("Updating Item");
                                if (spItem.Name)
                                    value.documentname(spItem.Name);
                                else
                                    value.documentname("");
                                if (spItem.DokumenttypId)
                                    value.documenttypeFK(spItem.DokumenttypId);
                                else
                                    value.documenttypeFK("");
                                if (spItem.Pfad)
                                    value.path(spItem.Pfad + "/" + spItem.Name);
                                else
                                    value.path("");
                                if (spItem.ProduktgruppeId)
                                    value.productgroupFK(spItem.ProduktgruppeId);
                                else
                                    value.productgroupFK("");
                                if (spItem.ProduktfamilieId)
                                    value.productfamilyFK(spItem.ProduktfamilieId);
                                else
                                    value.productfamilyFK("");
                                if (spItem.ProduktplattformId)
                                    value.productplatformFK(spItem.ProduktplattformId);
                                else
                                    value.productplatformFK("");
                                if (spItem.ProduktId)
                                    value.productFK(spItem.ProduktId);
                                else
                                    value.productFK("");
                                if (spItem.EquipmentId)
                                    value.equipmentFK(spItem.EquipmentId);
                                else
                                    value.equipmentFK("");
                                if (spItem.Geändert)
                                    value.spModifiedDate(utils.parseSharePointDate(spItem.Geändert));

                           //     console.log("updated item: " + value._data.documentId);

                            }
                            delete spItem;
                        } else//delete
                        {
                           // console.debug("lokales element wurde nicht mehr gefunden: ");
                          //  console.debug(value._data.documentId);
                            // delete local file from filesystem
                            if (value.localPath) {
                                window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
                                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                                    localFileSystemRoot = fileSystem.root.fullPath;
                                    try {
                                        //request filesystem to delete files if not found on SP anymore
                                        window.resolveLocalFileSystemURI(localFileSystemRoot + "/Dokumente/" + value.localPath, onSuccess, onError);

                                        function onSuccess(fileEntry) {
                                            fileEntry.remove();
                                            console.log('Deleted local file');
                                        }

                                        function onError() {
                                            console.log('Local File not Found');
                                        //    console.log(value);
                                        }

                                    } catch (e) {
                                        console.log('An error (exception) occured with the filesystem object');
                                        console.log(value);
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

            SyncModel.addSync(DOCUMENTS_LIST);
            $('body').trigger('sync-end');
            $('body').trigger('documents-sync-ready');
            $('#msgDocuments').removeClass('in');
        });
        delete lookupIDsSharePoint;
        delete spItemAdd;
        });
            });
 

      
    },

    downloadSharePointFiles : function() {
        Documents.all().list(null, function(results) {
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
                        folderName : "Dokumente",
                        fileName : data.documentname,
                        path : data.path
                    };
                    //check if the file needs to be downloaed (if no local modified date exists or the spmod date is newer then local

                    if (data.localModifiedDate) {

                        if (data.localModifiedDate.getTime() === data.spModifiedDate.getTime()) {

                            console.debug("skipped " + data.documentname);
                            queueProgress.qSuccess++;

                            //trigger event, as if downloaded
                            queueProgress.qIndex = index + 1;
                            if (queueProgress.qIndex === queueProgress.qLength) {
                                $('body').trigger('download-queue-ended', queueProgress);
                            } else {
                                $('body').trigger('download-queue-progress', queueProgress);
                            }
                            return true;
                            //skip
                        }

                    }

                    //end if download necessary
                    $.downloadQueue(downloadData).done(function(entrie) {
                        queueProgress.qSuccess++;

                        results[index].localPath(entrie.name);

                        //overwrite sync date with status of last sp modified date
                        //this isnt 100% accurate but it shouldnt matter. Downloading files does not refresh the Document list.
                        //Hence the SP File could be newer and the local database would still have the old modified date.
                        // but this really shouldnt matter. Worse thing that happens is one additional Download of the same file
                        try {
                            results[index].localModifiedDate(results[index]._data.spModifiedDate);
                            //        console.debug("modified date");
                        } catch (e) {
                            console.debug(e);
                            alert("Error overwriting modified date");
                        }

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

    searchDocuments : function(key) {
        var DocumentsSearch = $.Deferred();
        key = "%" + key.replace("*", "") + "%";
        key = key.replace(/ /g, '%');
        //replace changes only first instance . thats why the global modifier "g" of a regular expression was used. find all whitepaces and change to %

        Documents.all().filter("documentname", "LIKE", key).order("documentname", true, false).list(function(res) {
            DocumentsSearch.resolve(res);
        });

        return DocumentsSearch.promise();
    }
};
