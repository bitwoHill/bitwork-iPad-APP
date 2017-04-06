var DOCUMENTS_LIST = "Dokumente", DOCUMENTTYPES_LIST = "Dokumenttypen", localFileSystemRoot;
//these documents and documenttypes are used in MPlstammdaten.js

//in this case the foreignkeys are Text, because there can be a relation to several items
var Documents = persistence.define('Documents', {
    documentId: "INT",
    documentname: "TEXT",
    documenttypeFK: "INT",
    path: "TEXT",
    productgroupFK: "TEXT",
    productfamilyFK: "TEXT",
    productplatformFK: "TEXT",
    productFK: "TEXT",
    equipmentFK: "TEXT",
    spModifiedDate: "DATE",
    localPath: "TEXT",
    localModifiedDate: "DATE"
});

Documents.index(['documentId'], {
    unique: true
});

//Documenttypes
var Documenttypes = persistence.define('Documenttypes', {
    documenttypeId: "INT",
    name: "TEXT"
});
Documenttypes.index(['documenttypeId'], {
    unique: true
});

//create mock data for Documents and Documenttypes
var documentsModel = {
    sharePointDocuments: function () {
        //get documenttypes
        //  $('body').trigger('sync-start');
        $('#msgDocuments').toggleClass('in');

        SharePoint.sharePointRequest(DOCUMENTTYPES_LIST, documentsModel.mapSharePointDataDocumentTypes);
    },

    syncSharePointDocumentsWithoutDelete: function () {
        $('#msgDocuments').toggleClass('in');

        SharePoint.sharePointRequest(DOCUMENTTYPES_LIST, documentsModel.mapSharePointDataDocumentTypes, true);
    },

    //maps SharePoint data to current model
    mapSharePointDataDocumentTypes: function (data, syncAll) {
        var spData = data.d;
        console.log("mapSharePointDataDocumentTypes syncall " + syncAll);
        Documenttypes.all().destroyAll(function (ele) {// cant delete the whole list because of local path

            if (spData && spData.results.length) {
                $.each(spData.results, function (index, value) {
                    var documenttypeItem = {
                        documenttypeId: value.ID,
                        name: (value.Dokumenttyp) ? value.Dokumenttyp : ""
                    };

                    persistence.add(new Documenttypes(documenttypeItem));

                });

                persistence.flush(function () {
                    SyncModel.addSync(DOCUMENTTYPES_LIST);
                    //get documents
                    if (syncAll) //alles synchronisieren und alte Daten löschen
                        SharePoint.sharePointRequest(DOCUMENTS_LIST, documentsModel.mapSharePointData, true);
                    else {
                        var queryLatestItem = Documents.all().order("spModifiedDate", false).limit(1);
                        console.log("latest item Documents");
                        console.log(queryLatestItem);
                        queryLatestItem.list(null, function (results) {
                            console.log(results.length);
                            if (results.length == 0)
                                SharePoint.sharePointRequest(DOCUMENTS_LIST, documentsModel.mapSharePointData, true, utils.parseLocalDateToSharePointDate(new Date(0)));
                            else
                                results.forEach(function (r) {
                                    var latestItem = r
                                    var latestDate = latestItem.spModifiedDate();

                                    console.log("Document latest Date:");
                                    console.log(latestDate);
                                    //  console.log(utils.parseLocalDateToSharePointDate(latestDate));
                                    SharePoint.sharePointRequest(DOCUMENTS_LIST, documentsModel.mapSharePointData, true, utils.parseLocalDateToSharePointDate(latestDate));
                                });
                        });
                    }
                });

            } else {
                //get documents
                SharePoint.sharePointRequest(DOCUMENTS_LIST, documentsModel.mapSharePointData, true);
            }

        });
        delete spData;

    },
    //maps SharePoint data to current model
    mapSharePointData: function (data, DeleteItems) {
        console.log("mapSharePointDataDocumentTypes DeleteItems " + DeleteItems);

        //SharePoint Item Array
        var spData = data.d;
        //console.log(spData);
        //create lookup Array with all SP Items stored by ID. This is used to compare the Local Document IDs to those on Sharepoint
        var lookupIDsSharePoint = {};
        //One specific SharePoint Item used for Adding to local DB
        var spItemAdd;


        //For each SharePoint Resultitem- get all IDs which still exists on SP in order to delete local Documents not in this list.
        for (var i = 0, len = spData.results.length; i < len; i++) {

            try {
                //add element to Array of SPItems Indexed by ID

                spItemAdd = spData.results[i];
                //console.log(spItemAdd);
                lookupIDsSharePoint[spData.results[i].ID] = spData.results[i];

                //Get Multilookup IDS for Productgroups,platforms,families and product and equipment

                if (spItemAdd) {


                    var productgroupFKs = "";
                    if (spItemAdd.Produktgruppe) {

                        if (spItemAdd.Produktgruppe.results.length) {
                            if (spItemAdd.Produktgruppe.results.length > 0) {
                                for (var i2 = 0, len2 = spItemAdd.Produktgruppe.results.length; i2 < len2; i2++) {
                                    productgroupFKs += "_" + spItemAdd.Produktgruppe.results[i2].ID + ";";
                                }
                            }
                        }
                    }

                    var productfamilieFKs = "";
                    if (spItemAdd.Produktfamilie) {
                        if (spItemAdd.Produktfamilie.results.length) {
                            if (spItemAdd.Produktfamilie.results.length > 0) {
                                for (var i3 = 0, len3 = spItemAdd.Produktfamilie.results.length; i3 < len3; i3++) {
                                    productfamilieFKs += "_" + spItemAdd.Produktfamilie.results[i3].ID + ";";
                                }
                            }
                        }
                    }

                    var productplattformFKs = "";
                    if (spItemAdd.Produktplattform) {
                        if (spItemAdd.Produktplattform.results.length) {
                            if (spItemAdd.Produktplattform.results.length > 0) {
                                for (var i4 = 0, len4 = spItemAdd.Produktplattform.results.length; i4 < len4; i4++) {
                                    productplattformFKs += "_" + spItemAdd.Produktplattform.results[i4].ID + ";";
                                }
                            }
                        }
                    }

                    var productFKs = "";
                    if (spItemAdd.Produkt) {
                        if (spItemAdd.Produkt.results.length) {
                            if (spItemAdd.Produkt.results.length > 0) {
                                for (var i5 = 0, len5 = spItemAdd.Produkt.results.length; i5 < len5; i5++) {
                                    productFKs += "_" + spItemAdd.Produkt.results[i5].ID + ";";
                                }
                            }
                        }
                    }

                    var equipmentFKs = "";
                    if (spItemAdd.Equipment) {
                        if (spItemAdd.Equipment.results.length) {
                            if (spItemAdd.Equipment.results.length > 0) {
                                for (var i6 = 0, len6 = spItemAdd.Equipment.results.length; i6 < len6; i6++) {
                                    equipmentFKs += "_" + spItemAdd.Equipment.results[i6].ID + ";";
                                }
                            }
                        }
                    }

                }

                //     console.log(productgroupFKs);
                //     console.log(productFKs);
                //     console.log(productfamilieFKs);
                //     console.log(equipmentFKs);
                //     console.log(productplattformFKs);

                //add all items => to create new items
                var doc = {
                    documentId: spItemAdd.ID,
                    documentname: (spItemAdd.Name) ? spItemAdd.Name : "",
                    documenttypeFK: (spItemAdd.DokumenttypId) ? spItemAdd.DokumenttypId : "",
                    path: (spItemAdd.Pfad) ? spItemAdd.Pfad + "/" + spItemAdd.Name : "",
                    productgroupFK: (productgroupFKs) ? productgroupFKs : "",
                    productfamilyFK: (productfamilieFKs) ? productfamilieFKs : "",
                    productplatformFK: (productplattformFKs) ? productplattformFKs : "",
                    productFK: (productFKs) ? productFKs : "",
                    equipmentFK: (equipmentFKs) ? equipmentFKs : ""
                };
                //Parse modified date

                if (spItemAdd.Geändert) {
                    doc.spModifiedDate = utils.parseSharePointDate(spItemAdd.Geändert);
                }
//console.log(doc);
                //add to persistence instance
                persistence.add(new Documents(doc));
persistence.flush();
                // console.log("adding " + spItemAdd);

            } catch (e) {

                console.log(e);
                console.log(e.message);
                //alert("error");
            }

        }

        //persist new items to DB
        persistence.flush(function () {

            console.log("done adding new");

            //iterate all local files. If Document in LookupID List update, else delete by SP Item
            Documents.all().list(null, function (results99) {
                console.log("results99" + results99.length);
                if (results99.length) {

                    $.each(results99, function (index, value) {

                        //check if ID still exists on SharePoint
                        if (lookupIDsSharePoint[value._data.documentId]) {
                            //update routine / Adding routine
                            //One specific SharePoint Item used for Updateing local DB
                            var spItem;
                            //get SP Item stored in Array by ID of current local Item
                            spItem = lookupIDsSharePoint[value._data.documentId];
                            if (spItem) {

                                //Get Multilookup IDS for Productgroups,platforms,families and product and equipment
                                var productgroupFKs = "";
                                if (spItem.Produktgruppe) {
                                    for (var i2 = 0, len2 = spItem.Produktgruppe.results.length; i2 < len2; i2++) {
                                        productgroupFKs += "_" + spItem.Produktgruppe.results[i2].ID + ";";
                                    }
                                }
                                var productfamilieFKs = "";
                                if (spItem.Produktfamilie) {
                                    for (var i2 = 0, len3 = spItem.Produktfamilie.results.length; i2 < len3; i2++) {
                                        productfamilieFKs += "_" + spItem.Produktfamilie.results[i2].ID + ";";
                                    }
                                }
                                var productplattformFKs = "";
                                if (spItem.Produktplattform) {
                                    for (var i2 = 0, len4 = spItem.Produktplattform.results.length; i2 < len4; i2++) {
                                        productplattformFKs += "_" + spItem.Produktplattform.results[i2].ID + ";";
                                    }
                                }
                                var productFKs = "";
                                if (spItem.Produkt) {
                                    for (var i2 = 0, len5 = spItem.Produkt.results.length; i2 < len5; i2++) {
                                        productFKs += "_" + spItem.Produkt.results[i2].ID + ";";
                                    }
                                }
                                var equipmentFKs = "";
                                if (spItem.Equipment) {
                                    for (var i2 = 0, len6 = spItem.Equipment.results.length; i2 < len6; i2++) {
                                        equipmentFKs += "_" + spItem.Equipment.results[i2].ID + ";";
                                    }
                                }

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
                                if (productgroupFKs)
                                    value.productgroupFK(productgroupFKs);
                                else
                                    value.productgroupFK("");
                                if (productfamilieFKs)
                                    value.productfamilyFK(productfamilieFKs);
                                else
                                    value.productfamilyFK("");
                                if (productplattformFKs)
                                    value.productplatformFK(productplattformFKs);
                                else
                                    value.productplatformFK("");
                                if (productFKs)
                                    value.productFK(productFKs);
                                else
                                    value.productFK("");
                                if (equipmentFKs)
                                    value.equipmentFK(equipmentFKs);
                                else
                                    value.equipmentFK("");
                                if (spItem.Geändert)
                                    value.spModifiedDate(utils.parseSharePointDate(spItem.Geändert));

                             //   console.log("updated item: " + value._data.documentId);

                            }
                            delete spItem;
                        } else//delete
                        {
                            if (DeleteItems) {
                                console.debug("lokales element wurde nicht mehr gefunden: ");
                                //  console.debug(value._data.documentId);
                                // delete local file from filesystem
                                if (value.localPath) {
                                    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
                                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
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
                        }
                    });
                }
                console.log("done overwriting");

                persistence.flush(function () {
                    console.log("done flushing documents final");

                    SyncModel.addSync(DOCUMENTS_LIST);
                    // $('body').trigger('sync-end');
                    $('body').trigger('documents-sync-ready');
                    $('#msgDocuments').removeClass('in');
                });
                delete lookupIDsSharePoint;
                delete spItemAdd;

                if (DeleteItems) {
                     console.log("trigger resync");
                    documentsModel.downloadSharePointFiles();
                }
            });
        });

    },

    downloadSharePointFiles: function () {
        Documents.all().list(null, function (results) {
            if (results.length) {
                var queueProgress = {
                    qLength: results.length,
                    qIndex: 0,
                    qSuccess: 0,
                    qFail: 0
                };

                $('body').trigger('download-queue-started', queueProgress);

                $.each(results, function (index, value) {
                    var data = value._data, downloadData = {
                        folderName: "Dokumente",
                        fileName: data.documentname,
                        path: data.path
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
                    $.downloadQueue(downloadData).done(function (entrie) {
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
                    }).fail(function (entrie) {
                        queueProgress.qFail++;
                        //console.log("cnt f:" + index);
                    }).always(function () {
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
                    qLength: 1,
                    qIndex: 1,
                    qSuccess: 0,
                    qFail: 0
                });
            }
        });
    },

    searchDocuments: function (key) {
        var DocumentsSearch = $.Deferred();
        key = "%" + key.replace("*", "") + "%";
        key = key.replace(/ /g, '%');
        //replace changes only first instance . thats why the global modifier "g" of a regular expression was used. find all whitepaces and change to %

        Documents.all().filter("documentname", "LIKE", key).order("documentname", true, false).list(function (res) {
            DocumentsSearch.resolve(res);
        });

        return DocumentsSearch.promise();
    }
};
