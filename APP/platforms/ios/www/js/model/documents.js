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
    },
    //maps SharePoint data to current model
    mapSharePointData : function(data) {
        var spData = data.d;

        //create lookup Array with all IDs from SharePoint. This is used to compare the Local Document IDs to those on Sharepoint
        var lookupIDsSharePoint = {};
        var spItem;
    
        //For each SharePoint Resultitem
        for (var i = 0, len = spData.results.length; i < len; i++) {

            //add element to Array of IDs
            lookupIDsSharePoint[spData.results[i].ID] = spData.results[i];
               //overwrite Item for easier use
            spItem = spData.results[i];

            var doc = {
                documentId : spItem.ID,
                documentname : (spItem.Name) ? spItem.Name : "",
                documenttypeFK : (spItem.DokumenttypId) ? spItem.DokumenttypId : "",
                path : (spItem.Pfad) ? spItem.Pfad + "/" + spItem.Name : "",
                productgroupFK : (spItem.ProduktgruppeId) ? spItem.ProduktgruppeId : "",
                productfamilyFK : (spItem.ProduktfamilieId) ? spItem.ProduktfamilieId : "",
                productplatformFK : (spItem.ProduktplattformId) ? spItem.ProduktplattformId : "",
                productFK : (spItem.ProduktId) ? spItem.ProduktId : "",
                equipmentFK : (spItem.EquipmentId) ? spItem.EquipmentId : ""
            };
            //Parse modified date
            if (spItem.Geändert) {
                doc.spModifiedDate = utils.parseSharePointDate(spItem.Geändert);
            }
            //add to persistence instance
            persistence.add(new Documents(doc));

            //filter Database based on ID of SP Item
            Documents.findBy("documentId", spItem.ID, function(item) {
                //If item not found add new, else update
                if (!item) {
                    //  console.log("Adding item");

                    //add to persistence instance
                    //   persistence.add(new Documents(doc));

                } else {//update Item

                    //because of threading and instancing we now need to get the SP Item back
                    //=> Grep gets data based on the function where the ID matches our current DB ID
                    var resultSPList = $.grep(spData.results, function(e) {
                        return e.ID === item._data.documentId;
                    });
                    //&& utils.parseSharePointDate(e.Geändert) > item._data.spModifiedDate

                    //Grep gets a result set. but all we need is one item. we get the first (this should also be the only result!!)
                    var resultSP = resultSPList[0];

                    if (resultSP) {
                      //  console.log("Updating Item");
                        if (resultSP.Name)
                            item.documentname(resultSP.Name);
                        else
                            item.documentname("");
                        if (resultSP.DokumenttypId)
                            item.documenttypeFK(resultSP.DokumenttypId);
                        else
                            item.documenttypeFK("");
                        if (resultSP.Pfad)
                            item.path(resultSP.Pfad + "/" + resultSP.Name);
                        else
                            item.path("");
                        if (resultSP.ProduktgruppeId)
                            item.productgroupFK(resultSP.ProduktgruppeId);
                        else
                            item.productgroupFK("");
                        if (resultSP.ProduktfamilieId)
                            item.productfamilyFK(resultSP.ProduktfamilieId);
                        else
                            item.productfamilyFK("");
                        if (resultSP.ProduktplattformId)
                            item.productplatformFK(resultSP.ProduktplattformId);
                        else
                            item.productplatformFK("");
                        if (resultSP.ProduktId)
                            item.productFK(resultSP.ProduktId);
                        else
                            item.productFK("");
                        if (resultSP.EquipmentId)
                            item.equipmentFK(resultSP.EquipmentId);
                        else
                            item.equipmentFK("");
                        if (resultSP.Geändert)
                            item.spModifiedDate(utils.parseSharePointDate(resultSP.Geändert));

                    
                    }

                }

            });

        }

        console.log("done overwriting");
        persistence.flush(function() {

            //check wheter files need to be deleted
            //get all local files and check wheter its in the collection of the new SP files
            Documents.all().list(null, function(results) {
                if (results.length) {
                    $.each(results, function(index, value) {
                        //check if an object with the current ID exists. If Not delete it
                        if (!lookupIDsSharePoint[value._data.documentId]) {
                            console.debug("lokales element wurde nicht mehr gefunden: ");
                            console.debug(value);

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
                                            console.log('An error (on Error) occured with the filesystem object');
                                            console.log(value);

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
                    persistence.flush();
                }
            });

            console.debug("Cleaned local files");
            console.log("flushing");

            persistence.flush(function() {
                SyncModel.addSync(DOCUMENTS_LIST);
                $('body').trigger('sync-end');
                $('body').trigger('documents-sync-ready');
                $('#msgDocuments').removeClass('in');
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
                        //   results[index].localPath(entrie.fullPath);
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
