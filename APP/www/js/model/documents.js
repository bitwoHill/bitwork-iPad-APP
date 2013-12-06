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
    equipmentFK: "INT"
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
                }
            );

        }

        //get documents
        SharePoint.sharePointRequest(DOCUMENTS_LIST, documentsModel.mapSharePointData);

    },
    //maps SharePoint data to current model
    mapSharePointData: function (data) {
        var spData = data.d;
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
    },

    downloadSharePointFiles: function () {
        Documents.all().limit(1)
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
                            folderName: "Dokumente",
                            fileName: data.documentname,
                            path: data.path
                        };

                    $.downloadQueue(downloadData)
                    .done(
                        function(entrie){
                            queueProgress.qSuccess++;
                            results[index].path(entrie.fullPath);
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


   UpdateSharePointFiles: function () {
        Documents.all()
            .order('documentname', true, false)
            .list(null, function (results2) {
                if (results2.length) {
                    //get documents and download them
                    $.each(results2, function (index, value) {
                        var data = value._data;
                    });
                }
            });

   },

   DownloadSharePointFile: function (filename) {
        Documents.all()
            .order('documentname', true, false)
            .list(null, function (results2) {
                if (results2.length) {
                    //get documents and download them
                    $.each(results2, function (index, value) {
                        var data = value._data;
                    });
                }
            });

   }
};
