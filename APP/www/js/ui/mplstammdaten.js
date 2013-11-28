var equipmentproducts_CONTAINER = "#equipmentproducts-items-container";

//MPLstammdaten.js combines the data from equipmentproducts, otherprodcuts, documents, documenttypes and product options for mplstammdaten.html

//create mock data for equipment products
var equipmentproductsUI = {

    displayStammdaten: function () {
        var $container = $(equipmentproducts_CONTAINER);
        if ($container.length) {

            //hide optional fields
            $(documents_CONTAINER).addClass('hidden');
            $(productoptions_CONTAINER).addClass('hidden');



            //load by current url parameter / andhand von aktueller ID laden
            //var ProduktgruppePar = utils.getUrlParameter('Produktgruppe');
            //var ProduktfamiliePar = utils.getUrlParameter('Produktfamilie');
            //var ProduktplatformPar = utils.getUrlParameter('Produktplattform');
            var EquipmentProductPar = utils.getUrlParameter('EquipmentProdukt');
            var OtherProductPar = utils.getUrlParameter('SonstigesProdukt');

            //check wheter its found in the equipment table. if not search other products
            if (EquipmentProductPar) {
                EquipmentProducts.all().filter("equipmentId", "=", EquipmentProductPar).list(null, function (results) {
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
$('body').on('equipmentproducts-sync-ready otherproducts-sync-ready db-schema-ready', equipmentproductsUI.displayStammdaten);


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

            if (!EquipmentProductPar) {
                EquipmentProductPar = "-1";
            }
            if (!OtherProductPar) {
                OtherProductPar = "-1";
            }
            //check wheter there is an option to either the current equipment / other product or one of its lower level items (group, family, platform, product)
            ProductOptions.all()
                .filter("equipmentFK", "=", EquipmentProductPar)
                .or(new persistence.PropertyFilter("productgroupFK", "=", ProduktgruppePar))
                .or(new persistence.PropertyFilter("productfamilyFK", "=", ProduktfamiliePar))
                .or(new persistence.PropertyFilter("productplatformFK", "=", ProduktplatformPar))
                .or(new persistence.PropertyFilter("productFK", "=", ProduktPar))
                .order('productDescription', true, false)
                .list(null, function (results) {
                    if (results.length != 0) {
                        $productoptions_CONTAINER.removeClass('hidden');
                        alert("nicht null");
                    }
                    alert("null");
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
$('body').on('productoptions-sync-ready db-schema-ready', productoptionsUI.displayOptions);






//this part is about the documents

var documents_CONTAINER = "#document-items-container",
documents_DOCUMENT_TEMPLATE = "#document-document-item-template",
documents_FOLDER_TEMPLATE = "#document-folder-item-template";


//displaydata for options in MPL
var DocumentsUI = {

    displayDocuments: function () {
        var $containerRoot = $(documents_CONTAINER),
      $templateDocument = $(documents_DOCUMENT_TEMPLATE),
       $templateFolder = $(documents_FOLDER_TEMPLATE);

        if ($containerRoot.length && $templateDocument.length && $templateFolder.length) {
            //load documents by current url parameter / andhand von aktueller ID laden
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



            //load all documents and then figure out which documenttypes are needed

            var counter = 0;
            Documents.all()
             .filter("equipmentFK", "=", EquipmentProductPar)
             .or(new persistence.PropertyFilter("productgroupFK", "=", ProduktgruppePar))
             .or(new persistence.PropertyFilter("productfamilyFK", "=", ProduktfamiliePar))
             .or(new persistence.PropertyFilter("productplatformFK", "=", ProduktplatformPar))
             .or(new persistence.PropertyFilter("productFK", "=", ProduktPar))
                               .list(null, function (results) {

                                   var documenttypeslist = []; //store all unique documenttypes

                                   $.each(results, function (index, value) {
                                       var data = value._data;


                                       //first get all documenttypes to either the current equipment / other
                                       //product or one of its lower level items (group, family, platform, product)

                                       //check wheter the ID is in the array allready. if not add it
                                       if ($.inArray(data.documenttypeFK, documenttypeslist) == -1) {
                                           documenttypeslist[counter] = data.documenttypeFK;
                                           counter++;

                                           //create "folder" for this new document type in treeview
                                           Documenttypes.all()
                                            .filter("documenttypeId", "=", data.documenttypeFK)
                                              .list(null, function (results) {
                                                  $.each(results, function (index, value) {
                                                 
                                                      var data2 = value._data,
                                                      newItem2;

                                                      newItem2 = $templateFolder.clone();
                                                      newItem2.removeAttr('id');
                                                      $('.tree-nav-item-name', newItem2).html(data2.name);
                                                      $('.tree-nav-link', newItem2).attr("data-item-id", data2.documenttypeId);

                                                      $containerRoot.append(newItem2.removeClass('hidden'));
                                                      $containerRoot.removeClass('hidden');
                                                      //$templateDocument.removeClass('hidden');


                                                  });
                                              });

                                       }
                                   });
                               });

        }
    },


    updateDocumentsTree: function (container, nodeId) {
        var $templateItem = $(documents_DOCUMENT_TEMPLATE),
            $templateFolder = $(documents_FOLDER_TEMPLATE);

        var ProduktgruppePar = utils.getUrlParameter('Produktgruppe');
        var ProduktfamiliePar = utils.getUrlParameter('Produktfamilie');
        var ProduktplatformPar = utils.getUrlParameter('Produktplattform');
        var ProduktPar = utils.getUrlParameter('Produkt');
        var EquipmentProductPar = utils.getUrlParameter('EquipmentProdukt');

        if (container.length && $templateFolder.length && $templateItem.length) {

            //now get all documents based on the selected documenttypeID

            Documents.all()
               .filter("equipmentFK", "=", EquipmentProductPar)
               .and(new persistence.PropertyFilter("documenttypeFK", "=", nodeId))
               .or(new persistence.AndFilter(new persistence.PropertyFilter("productgroupFK", "=", ProduktgruppePar), new persistence.PropertyFilter("documenttypeFK", "=", nodeId)))
               .or(new persistence.AndFilter(new persistence.PropertyFilter("productfamilyFK", "=", ProduktfamiliePar), new persistence.PropertyFilter("documenttypeFK", "=", nodeId)))
               .or(new persistence.AndFilter(new persistence.PropertyFilter("productplatformFK", "=", ProduktplatformPar), new persistence.PropertyFilter("documenttypeFK", "=", nodeId)))
           .or(new persistence.AndFilter(new persistence.PropertyFilter("productFK", "=", ProduktPar), new persistence.PropertyFilter("documenttypeFK", "=", nodeId)))
           .list(null, function (results) {

               $.each(results, function (index, value) {
                   var data = value._data,
                       newItem;

                   if (data.isFolder) {
                       newItem = $templateFolder.clone();
                   } else {
                       newItem = $templateItem.clone();
                   }

                   newItem.removeAttr('id');

                   $('.tree-nav-item-name', newItem).html(data.documentname);
                   $('.tree-nav-link', newItem).attr("data-item-id", data.documentId);

                   if (data.path) {
                       $('.tree-nav-link', newItem).attr("href", data.path);
                   }

                   container.append(newItem.removeClass('hidden'));
               });
           });
        }
    }
};


//bind to sync ready event in order to display the news
$('body').on('documents-sync-ready db-schema-ready', DocumentsUI.displayDocuments);


$(document).ready(function () {

    $('body').on('click', '.tree-nav-link.folder', function (e) {
        e.preventDefault();
        var $this = $(this),
            nodeId = $this.attr("data-item-id"),
            container = $this.siblings("ul.tree-nav"),
            $icon = $('.fa', $this);

        if (container.length && $('li', container).length === 0) {
            DocumentsUI.updateDocumentsTree(container, nodeId);
        }

        $this.siblings("ul.tree-nav").toggle(300);
        $this.toggleClass("collapsed");

        if ($icon.hasClass('fa-folder')) {
            $icon.removeClass('fa-folder').addClass('fa-folder-open');
        } else {
            $icon.removeClass('fa-folder-open').addClass('fa-folder');
        }
    });
});
