var documents_SYNC_URL = "content/documents.json",
    documenttypes_SYNC_URL = "content/documenttypes.json";

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
    equipmentFK: "TEXT"
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
    sharePointSync: function (callback) {
        //set documenttypes
        //TODO: replace with sharepoint connection
        $.getJSON(documenttypes_SYNC_URL, function (data) {

            $.each(data, function (index, value) {
                var documenttypeItem;

                documenttypeItem = new Documenttypes(value);
                persistence.add(documenttypeItem);
            });

            persistence.flush(
                function () {
                    //DB is updated - trigger custom event
                    if (typeof callback === "function") {
                        callback();
                    }


                    //$('body').trigger('documents-sync-ready');
                }
            );
        }).fail(
            function () {
                //TODO: error handling if necessary
                alert("MPL Stammdaten Documenttypes: Mock data read error.");

                if (typeof callback === "function") {
                    callback();
                }
            }
        );

        //set documents
        //TODO: replace with sharepoint connection
        $.getJSON(documents_SYNC_URL, function (data) {

            $.each(data, function (index, value) {
                var documentsItem;

                documentsItem = new Documents(value);
                persistence.add(documentsItem);
            });

            persistence.flush(
                function () {
                    //DB is updated - trigger custom event
                    if (typeof callback === "function") {
                        callback();
                    }

                    $('body').trigger('documents-sync-ready');
                }
            );
        }).fail(
            function () {
                //TODO: error handling if necessary
                alert("MPL Stammdaten Documents: Mock data read error.");

                if (typeof callback === "function") {
                    callback();
                }
            }
        );



    }

};
