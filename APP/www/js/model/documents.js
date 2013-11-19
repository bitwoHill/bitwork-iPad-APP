var documents_SYNC_URL = "content/documents.json",
    documenttypes_SYNC_URL = "content/documenttypes.json",
           documents_CONTAINER = "#document-items-container",
      documents_ITEM_TEMPLATE = "#document-item-template";
//create mock data for Documents and Documenttypes
var documentsUtils = {
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



    },




    //create mockdata for options 

    displayStammdaten: function () {
        var $container = $(documents_CONTAINER),
        $template = $(documents_ITEM_TEMPLATE);



        if ($container.length && $template.length) {
            //load options by current url parameter / andhand von aktueller ID laden
            var ProduktgruppePar = utils.getUrlParameter('Produktgruppe');
            var ProduktfamiliePar = utils.getUrlParameter('Produktfamilie');
            var ProduktplatformPar = utils.getUrlParameter('Produktplattform');
            var ProduktPar = utils.getUrlParameter('Produkt');
            var EquipmentProductPar = utils.getUrlParameter('EquipmentProdukt');
            var OtherProductPar = utils.getUrlParameter('SonstigesProdukt');

            //if its an equipment page the otherproduct is empty (or the other way around) -  this would cause problems in the SQL query - hence its set to -1)
            //TODO order by name

            if (!EquipmentProductPar) {
                EquipmentProductPar = "-1";
            }
            if (!OtherProductPar) {
                OtherProductPar = "-1";
            }
            //check wheter there is an document to either the current equipment / other product or one of its lower level items (group, family, platform, product)
            documents.all()
             .filter("EquipmentFK", "=", EquipmentProductPar)
             .or(new persistence.PropertyFilter("productgroupFK", "=", ProduktgruppePar))
             .or(new persistence.PropertyFilter("productfamilyFK", "=", ProduktfamiliePar))
             .or(new persistence.PropertyFilter("productplatformFK", "=", ProduktplatformPar))
             .or(new persistence.PropertyFilter("productFK", "=", ProduktPar))
                               .list(null, function (results) {
                                                $.each(results, function (index, value) {

                                                    var data = value._data;
                                                    var $newItem = $template.clone();

                                                    $newItem.removeAttr('id');
                                                    $('.document-item-optionsbezeichnung', $newItem).html(data.productDescription);
                                                    $('.document-item-teilenummer', $newItem).html(data.pieceNumber);
                                                    $('.document-item-listenpreis', $newItem).html(data.price);

                                                    $container.append($newItem.removeClass('hidden'));
                                                });
                                            });
        }
    }
}
;

//bind to sync ready event in order to display the news
$('body').on('documents-sync-ready', documentsUtils.displayStammdaten);


