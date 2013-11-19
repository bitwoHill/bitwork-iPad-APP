var equipmentproducts_CONTAINER = "#equipmentproducts-items-container";

//MPLstammdaten.js combines the data from equipmentproducts, otherprodcuts, documents, documenttypes and product options for mplstammdaten.html

//create mock data for equipment products
var equipmentproductsUI = {

    displayStammdaten: function () {
        var $container = $(equipmentproducts_CONTAINER);
        if ($container.length) {

            //load by current url parameter / andhand von aktueller ID laden
            var ProduktgruppePar = utils.getUrlParameter('Produktgruppe');
            var ProduktfamiliePar = utils.getUrlParameter('Produktfamilie');
            var ProduktplatformPar = utils.getUrlParameter('Produktplattform');
            var EquipmentProductPar = utils.getUrlParameter('EquipmentProdukt');
            var OtherProductPar = utils.getUrlParameter('SonstigesProdukt');

            //check wheter its found in the equipment table. if not search other products
            if (EquipmentProductPar) {
                EquipmentProducts.all().filter("equipmentId", "=", EquipmentProductPar).order().list(null, function (results) {
                    $.each(results, function (index, value) {


                        var data = value._data;
                        document.getElementById("valueProductDescription").innerHTML = data.productDescription;
                        document.getElementById("valuePiecenumber").innerHTML = data.pieceNumber;
                        document.getElementById("valuePrice").innerHTML = data.price;
                        document.getElementById("valueCooling").innerHTML = data.cooling;
                        document.getElementById("valueVariant").innerHTML = data.variant;
                        document.getElementById("valueVolume").innerHTML = data.volume;
                        document.getElementById("valuePressure").innerHTML = data.pressure;
                        document.getElementById("valuePerformance").innerHTML = data.performance;

                    });

                    //if not found in equipment table look for other products


                });
            }

            if (OtherProductPar) {
                OtherProducts.all().filter("otherProductId", "=", OtherProductPar).list(null, function (results) {
                    $.each(results, function (index, value) {

                        var data = value._data;
                        document.getElementById("valueProductDescription").innerHTML = data.productDescription;
                        document.getElementById("valuePiecenumber").innerHTML = data.pieceNumber;
                        document.getElementById("valuePrice").innerHTML = data.price;
                        $("#rowCooling").hide();
                        $("#rowVariant").hide();
                        $("#rowVolume").hide();
                        $("#rowPressure").hide();
                        $("#rowPerformance").hide();
                    });

                    //if not found in equipment table look for other products


                });
            }
        }
    }
};

//bind to sync ready event in order to display the news
$('body').on('equipmentproducts-sync-ready otherproducts-sync-ready', equipmentproductsUI.displayStammdaten);


//this part is about the options
var productoptions_CONTAINER = "#productoptions-items-container",
    productoptions_ITEM_TEMPLATE = "#productoptions-item-template";

var productoptionsUI = {
    displayOptions: function () {
        var $container = $(productoptions_CONTAINER),
            $template = $(productoptions_ITEM_TEMPLATE);


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
            //check wheter there is an option to either the current equipment / other product or one of its lower level items (group, family, platform, product)
            persistence.debug = true;
            ProductOptions.all()
                .filter("equipmentFK", "=", EquipmentProductPar)
                .or(new persistence.PropertyFilter("productgroupFK", "=", ProduktgruppePar))
                .or(new persistence.PropertyFilter("productfamilyFK", "=", ProduktfamiliePar))
                .or(new persistence.PropertyFilter("productplatformFK", "=", ProduktplatformPar))
                .or(new persistence.PropertyFilter("productFK", "=", ProduktPar))
                .list(null, function (results) {
                    $.each(results, function (index, value) {

                        var data = value._data;
                        var $newItem = $template.clone();

                        $newItem.removeAttr('id');
                        $('.productoption-item-optionsbezeichnung', $newItem).html(data.productDescription);
                        $('.productoption-item-teilenummer', $newItem).html(data.pieceNumber);
                        $('.productoption-item-listenpreis', $newItem).html(data.price);

                        $container.append($newItem.removeClass('hidden'));
                    });
                });
        }
    }
};

//bind to sync ready event in order to display the news
$('body').on('productoptions-sync-ready', productoptionsUI.displayOptions);






//this part is about the documents


var documents_CONTAINER = "#document-items-container",
documents_ITEM_TEMPLATE = "#document-item-template";


//displaydata for options in MPL
var DocumentsUI = {

    displayDocuments: function () {
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
             .filter("equipmentFK", "=", EquipmentProductPar)
             .or(new persistence.PropertyFilter("productgroupFK", "=", ProduktgruppePar))
             .or(new persistence.PropertyFilter("productfamilyFK", "=", ProduktfamiliePar))
             .or(new persistence.PropertyFilter("productplatformFK", "=", ProduktplatformPar))
             .or(new persistence.PropertyFilter("productFK", "=", ProduktPar))
                               .list(null, function (results) {
                                   $.each(results, function (index, value) {

                                       var data = value._data;
                                       var $newItem = $template.clone();

                                       $newItem.removeAttr('id');
                                       //$('.document-item-optionsbezeichnung', $newItem).html(data.productDescription);
                                       //$('.document-item-teilenummer', $newItem).html(data.pieceNumber);
                                       //$('.document-item-listenpreis', $newItem).html(data.price);

                                       $container.append($newItem.removeClass('hidden'));
                                   });
                               });
        }
    }
}
;

//bind to sync ready event in order to display the news
$('body').on('documents-sync-ready', DocumentsUI.displayDocuments);




