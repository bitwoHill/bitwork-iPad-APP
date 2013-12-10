var DOCUMENTS_LIST = "Dokumente",
 DOCUMENTTYPES_LIST = "Dokumenttypen";
//these documents and documenttypes are used in MPlstammdaten.js


//in this case the foreignkeys are Text, because there can be a relation to several items
var Documents = persistence.define('Documents', {
    documentId: "INT",
    documentname: "TEXT",
    documenttypeFK: "INT",
    path: "TEXT",
    productgroupFK: "INT",
    productfamilyFK: "INT",
    productplatformFK: "INT",
    productFK: "INT",
    equipmentFK: "INT",
    spModifiedDate: "DATE",
    localPath: "TEXT",
    localModifiedDate: "DATE"
});

Documents.index(['documentId'], { unique: true });


//Documenttypes
var Documenttypes = persistence.define('Documenttypes', {
    documenttypeId: "INT",
    name: "TEXT"
});
Documenttypes.index(['documenttypeId'], { unique: true });


//create mock data for Documents and Documenttypes
var documentsModel = {
    sharePointDocuments: function () {
        //get documenttypes
        //  $('body').trigger('sync-start');
        SharePoint.sharePointRequest(DOCUMENTTYPES_LIST, documentsModel.mapSharePointDataDocumentTypes);
    },
    //maps SharePoint data to current model
    mapSharePointDataDocumentTypes: function (data) {
        var spData = data.d;
        Documenttypes.all().destroyAll(function (ele) {  // cant delete the whole list because of local path


            if (spData && spData.results.length) {
                $.each(spData.results, function (index, value) {
                    var documenttypeItem =
                            {
                                documenttypeId: value.ID,
                                name: (value.Dokumenttyp) ? value.Dokumenttyp : ""
                            };

                    persistence.add(new Documenttypes(documenttypeItem));


                });

                persistence.flush(
                    function () {
                        SyncModel.addSync(DOCUMENTTYPES_LIST);
                        //get documents

                        SharePoint.sharePointRequest(DOCUMENTS_LIST, documentsModel.mapSharePointData);
                    }
                );

            } else {
                //get documents
                SharePoint.sharePointRequest(DOCUMENTS_LIST, documentsModel.mapSharePointData);
            }

        });
    },
    //maps SharePoint data to current model
    mapSharePointData: function (data) {
        var spData = data.d;

        //create lookup Array with all IDs from SharePoint. This is used to compare the Local Document IDs to them on Sharepoint
        var lookupIDsSharePoint = {};
        for (var i = 0, len = spData.results.length; i < len; i++) {
            lookupIDsSharePoint[spData.results[i].ID] = spData.results[i];
        }


        //check wheter files need to be deleted
        //get all local files and check wheter its in the collection of the new SP files
        Documents.all().list(null, function (results) {
            if (results.length) {
                $.each(results, function (index, value) {
                    //check if an object with the current ID exists. If Not delete it
                    if (!lookupIDsSharePoint[value._data.documentId]) {
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
                    if (spData && spData.results.length) {

                        $.each(spData.results, function (index, value) {

                            var documentsItem =
                                    {
                                        documentId: value.ID,
                                        documentname: (value.Name) ? value.Name : "",
                                        documenttypeFK: (value.DokumenttypId) ? value.DokumenttypId : "",
                                        path: (value.Pfad + "/" + value.Name) ? value.Pfad + "/" + value.Name : "",
                                        productgroupFK: (value.ProduktgruppeId) ? value.ProduktgruppeId : "",
                                        productfamilyFK: (value.ProduktfamilieId) ? value.ProduktfamilieId : "",
                                        productplatformFK: (value.ProduktplattformId) ? value.ProduktplattformId : "",
                                        productFK: (value.ProduktId) ? value.ProduktId : "",
                                        equipmentFK: (value.EquipmentId) ? value.EquipmentId : ""
                                    };
                            if (value.Geändert) {
                                documentsItem.spModifiedDate = utils.parseSharePointDate(value.Geändert);
                            }
                            persistence.add(new Documents(documentsItem));
                        });

                        persistence.flush(
                            function () {
                                SyncModel.addSync(DOCUMENTS_LIST);
                                $('body').trigger('sync-end');
                                $('body').trigger('documents-sync-ready');
                            }
                        );
                    }

                });
    },

    downloadSharePointFiles: function () {
        Documents.all().limit(5)
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
                            folderName: "Dokumente",
                            fileName: data.documentname,
                            path: data.path
                        };
                    //check if the file needs to be downloaed (if no local modified date exists or the spmod date is newer then local
                    if (!data.localModifiedDate || data.localModifiedDate < data.spModifiedDate) {
                        $.downloadQueue(downloadData)
                        .done(
                            function (entrie) {
                                queueProgress.qSuccess++;
                                results[index].localpath(entrie.fullPath);
                                //overwrite sync date with status of last sp modified date
                                //this isnt 100% accurate but it shouldnt matter. Downloading files does not refresh the Document list.
                                //Hence the SP File could be newer and the local database would still have the old modified date. 
                                // but this really shouldnt matter. Worse thing that happens is one additional Download of the same file
                                results[index].localModifiedDate(results[index].spModifiedDate);
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
                    } //end if download necessary

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
    }
};
