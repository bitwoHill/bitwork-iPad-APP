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
    name: "TEXT",
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
        Documents.all()
                  .list(null, function (results2) {
                      if (results2.length) {

                          //get documents and download them
                          function initFS(fs) {
                              alert("Welcome to Filesystem! It's showtime"); // Just to check if everything is OK :)

                              //Create Mock file to filesystem

                              window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
                              window.requestFileSystem(window.PERSISTENT, 7 * 1024 * 1024, initFS, errorHandler);


                              $.each(results2, function (index, value) {
                                  var data = value._data;

                              


                                  // create filetransfer object
                                  var ft = new FileTransfer();

                                  var folderName = "Dokumente";
                                  var fileName = "dummy.html";
                                  var folderDir;
                                  var fileDir;

                                  // download url
                                  alert(1);
                                  var uri = encodeURI(settings.content + "");
                                  console.debug(uri)
                                  alert(2);

                                  //               create folder if not existant else access it
                                  fs.root.getDirectory(folderName, { create: true, exclusive: false },
                                      function (dirEntry) {
                                          folderDir = dirEntry;
                                          //     Create File. somehow this needs to be done first before the download started
                                          folderDir.getFile
                                              (fileName, { create: true, exclusive: false }, function (fileEntry) {
                                                  fileDir = fileEntry;
                                                  //  created the files hull needed for download. Save the path. 
                                                  var fullpath = fileDir.fullPath.replace(fileName, "");
                                                  // now delete the file (for what ever reason)
                                                  fileDir.remove();

                                                  //      download file


                                                  ft.download
                                                      (uri, fullpath + fileName, function (entry) {
                                                          alert("Download success!" + entry.fullPath);
                                                      },
                                                  function (error) {
                                                      alert("download error source " + error.source);
                                                      alert("download error target " + error.target);
                                                      alert("upload error code" + error.code);

                                                  },
                                                        true
                                                    );

                                              });


                                      });







                              });
                          }
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
