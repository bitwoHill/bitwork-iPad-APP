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
    productoptions_ITEM_CHILD_Container = "#productoptions-item-child-container",
    productoptions_ITEM_TEMPLATE = "#productoptions-item-template";

var productoptionsUI = {
    displayOptions: function () {
        var $container = $(productoptions_CONTAINER),
            $childcontainer = $(productoptions_ITEM_CHILD_Container),
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
                        $container.removeClass('hidden');

                    }

                    $.each(results, function (index, value) {

                        var data = value._data;
                        var $newItem = $template.clone();
                        $newItem.removeAttr('id');
                        $('.productoption-item-optionsbezeichnung', $newItem).html(data.productDescription);
                        $('.productoption-item-teilenummer', $newItem).html(data.pieceNumber);
                        $('.productoption-item-listenpreis', $newItem).html(data.price);
                        $childcontainer.append($newItem.removeClass('hidden'));

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
 
    /*
        // get all Documenttypes
        displayDocumentTypes: function () {
            var $containerRoot = $(documents_CONTAINER),
           $templateFolder = $(documents_FOLDER_TEMPLATE);
    
            if ($containerRoot.length && $templateFolder.length) {
                //load documents by current url parameter / andhand von aktueller ID laden
                var ProduktgruppePar = utils.getUrlParameter('Produktgruppe');
                var ProduktfamiliePar = utils.getUrlParameter('Produktfamilie');
                var ProduktplatformPar = utils.getUrlParameter('Produktplattform');
                var ProduktPar = utils.getUrlParameter('Produkt');
                var EquipmentProductPar = utils.getUrlParameter('EquipmentProdukt');
                var OtherProductPar = utils.getUrlParameter('SonstigesProdukt');
                var documenttypeslist = []; //store all unique documenttypes
                var counter = 0; //counter to acces documenttype Array
    
                //if its an equipment page the otherproduct is empty (or the other way around) -  this would cause problems in the SQL query - hence its set to -1)
    
                if (!EquipmentProductPar) {
                    EquipmentProductPar = "-1";
                }
                if (!OtherProductPar) {
                    OtherProductPar = "-1";
                }
    
    
                //load all documents and then figure out which documenttypes are needed
    
                //Nope this query does not do, what they want... 
                //Documents.all()
                // .filter("equipmentFK", "=", EquipmentProductPar)
                // .or(new persistence.PropertyFilter("productgroupFK", "=", ProduktgruppePar))
                // .or(new persistence.PropertyFilter("productfamilyFK", "=", ProduktfamiliePar))
                // .or(new persistence.PropertyFilter("productplatformFK", "=", ProduktplatformPar))
                // .or(new persistence.PropertyFilter("productFK", "=", ProduktPar))
                // .order('documentname', true, false)
                //                               .list(null, function (results) {
                //console.debug("gefundene dokumente" + results.length);
    
                //original query from .NET
    
                //RowFilter = "(Produktgruppe = '" & strProduktGruppe & "') AND (Produktfamilie = '" & strProduktFamilie & "') AND (Produktplattform = '" & strProduktPlattform & "') AND (Produkt = '" & strProdukt & "') AND (Equipment = '" & strEquipment & "') OR " & _
                //   "(Produktgruppe = '" & strProduktGruppe & "') AND (Produktfamilie = '" & strProduktFamilie & "') AND (Produktplattform = '" & strProduktPlattform & "') AND (Produkt = '" & strProdukt & "') AND (Equipment = '') OR " & _
                //   "(Produktgruppe = '" & strProduktGruppe & "') AND (Produktfamilie = '" & strProduktFamilie & "') AND (Produktplattform = '" & strProduktPlattform & "') AND (Produkt = '') AND (Equipment = '') OR " & _
                //   "(Produktgruppe = '" & strProduktGruppe & "') AND (Produktfamilie = '" & strProduktFamilie & "') AND (Produktplattform = '') AND (Produkt = '') AND (Equipment = '') OR " & _
    
                //   "(Produktgruppe = '" & strProduktGruppe & "') AND (Produktfamilie = '') AND (Produktplattform = '') AND (Produkt = '') AND (Equipment = '') OR " & _
                //   "(Produktgruppe = '') AND (Produktfamilie = '" & strProduktFamilie & "') AND (Produktplattform = '') AND (Produkt = '') AND (Equipment = '') OR " & _
                //   "(Produktgruppe = '') AND (Produktfamilie = '') AND (Produktplattform = '" & strProduktPlattform & "') AND (Produkt = '') AND (Equipment = '') OR " & _
                //   "(Produktgruppe = '') AND (Produktfamilie = '') AND (Produktplattform = '') AND (Produkt = '" & strProdukt & "') AND (Equipment = '') OR " & _
                //   "(Produktgruppe = '') AND (Produktfamilie = '') AND (Produktplattform = '') AND (Produkt = '') AND (Equipment = '" & strEquipment & "')"
    
    
                //this is one fcked up query, but does what they need. either exact matches or party exact matches
    
    
    
                persistence.debug = true;
                //Documents.all().filter("equipmentFK", "=", EquipmentProductPar)// case 1: total match
                // .and(new persistence.PropertyFilter("productFK", "=", ProduktPar))
                // .and(new persistence.PropertyFilter("productplatformFK", "=", ProduktplatformPar))
                // .and(new persistence.PropertyFilter("productfamilyFK", "=", ProduktfamiliePar))
                // .and(new persistence.PropertyFilter("productgroupFK", "=", ProduktgruppePar))
                // .or(new persistence.PropertyFilter("equipmentFK", "=", "")) //case 2: No equipment but complete group, family, platform or product
                // .and(new persistence.PropertyFilter("productFK", "=", ProduktPar))
                // .and(new persistence.PropertyFilter("productplatformFK", "=", ProduktplatformPar))
                // .and(new persistence.PropertyFilter("productfamilyFK", "=", ProduktfamiliePar))
                // .and(new persistence.PropertyFilter("productgroupFK", "=", ProduktgruppePar))
                // .or(new persistence.PropertyFilter("equipmentFK", "=", "")) //case 3: No equipment and no product but complete group, family, platform 
                // .and(new persistence.PropertyFilter("productFK", "=", ""))
                // .and(new persistence.PropertyFilter("productplatformFK", "=", ProduktplatformPar))
                // .and(new persistence.PropertyFilter("productfamilyFK", "=", ProduktfamiliePar))
                // .and(new persistence.PropertyFilter("productgroupFK", "=", ProduktgruppePar))
                //  .or(new persistence.PropertyFilter("equipmentFK", "=", "")) //case 4: No equipment and no product platform but complete group, family 
                // .and(new persistence.PropertyFilter("productFK", "=", ""))
                // .and(new persistence.PropertyFilter("productplatformFK", "=", ""))
                // .and(new persistence.PropertyFilter("productfamilyFK", "=", ProduktfamiliePar))
                // .and(new persistence.PropertyFilter("productgroupFK", "=", ProduktgruppePar))
                // .or(new persistence.PropertyFilter("equipmentFK", "=", "")) //case 5: No equipment and no product, platform, family but complete group
                // .and(new persistence.PropertyFilter("productFK", "=", ""))
                // .and(new persistence.PropertyFilter("productplatformFK", "=", ""))
                // .and(new persistence.PropertyFilter("productfamilyFK", "=", ""))
                // .and(new persistence.PropertyFilter("productgroupFK", "=", ProduktgruppePar))
                // .or(new persistence.PropertyFilter("equipmentFK", "=", "")) //case 6: empty group, matching family but also no platform, no platform and no product and no equipment
                // .and(new persistence.PropertyFilter("productFK", "=", ""))
                // .and(new persistence.PropertyFilter("productplatformFK", "=", ""))
                // .and(new persistence.PropertyFilter("productfamilyFK", "=", ProduktfamiliePar))
                // .and(new persistence.PropertyFilter("productgroupFK", "=", ""))
                // .or(new persistence.PropertyFilter("equipmentFK", "=", "")) //case 7: empty group, empty family, matching platform   but and no product and no equipment
                // .and(new persistence.PropertyFilter("productFK", "=", ""))
                // .and(new persistence.PropertyFilter("productplatformFK", "=", ProduktplatformPar))
                // .and(new persistence.PropertyFilter("productfamilyFK", "=", ""))
                // .and(new persistence.PropertyFilter("productgroupFK", "=", ""))
                // .or(new persistence.PropertyFilter("equipmentFK", "=", "")) //case 8: empty group, empty family, empty platform   but matching product  and no equipment
                // .and(new persistence.PropertyFilter("productFK", "=", ProduktPar))
                // .and(new persistence.PropertyFilter("productplatformFK", "=", ""))
                // .and(new persistence.PropertyFilter("productfamilyFK", "=", ""))
                // .and(new persistence.PropertyFilter("productgroupFK", "=", ""))
                // .or(new persistence.PropertyFilter("equipmentFK", "=", EquipmentProductPar)) //case 9: empty group, empty family, empty platform   empty product  but matching equipment
                // .and(new persistence.PropertyFilter("productFK", "=", ""))
                // .and(new persistence.PropertyFilter("productplatformFK", "=", ""))
                // .and(new persistence.PropertyFilter("productfamilyFK", "=", ""))
                // .and(new persistence.PropertyFilter("productgroupFK", "=", ""))
    
                Documents.all()
                  .order('documentname', true, false)
                    .list(null, function (results2) {
                        persistence.debug = false;
                        if (results2.length) 
                        { 
                        //get all types in found documents
                            $.each(results2, function (index, value) {
                                var data = value._data;
                              //  console.debug(data);
                               if ($.inArray(data.documenttypeFK, documenttypeslist) === -1) {
                               //   console.debug(data);
                                   documenttypeslist[counter] = data.documenttypeFK;
                                   counter++;
                               }
                           });
                            setTimeout(function () { 
    
                           //at this point we know all document types
                              console.debug(documenttypeslist);
    
                           //get all Documenttypess. Then check if its used in the query for all documents
                           Documenttypes.all()
                           .order('name', true, false)
                           .list(null, function (results) {
                               $.each(results, function (index, value) {
                                   var data = value._data,
                                   newItem;
    
    
                                   //check wheter the current documenttyp is in documenttype list. if not skip the creation of an divblock
                                   //if ($.inArray(data.documenttypeId, documenttypeslist) != -1) {
                                   //    return true; //skip in jquery way ;) 
                                   //}
                                   //console.debug(data.documenttypeId);
    
    
                                   newItem = $templateFolder.clone();
                                   newItem.removeAttr('id');
                                   $('.tree-nav-item-name', newItem).html(data.name);
                                   $('.tree-nav-link', newItem).attr("data-item-id", data.documenttypeId);
    
                                   //$containerRoot.append(newItem.removeClass('hidden'));
                                   $containerRoot.removeClass('hidden');
    
                               });
                           });
                            }, 4000);
                        }
                       });
                    
    
            }
        },
                */



    //OLD -#################################################################################################################################################################
    //OLD -#################################################################################################################################################################
    //OLD -#################################################################################################################################################################
    //OLD -#################################################################################################################################################################
    //OLD -#################################################################################################################################################################
    /* displayDocuments: function () {
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
              .order('documentname', true, false)
                                            .list(null, function (results) {
 
                                                var documenttypeslist = []; //store all unique documenttypes
                                               
                                                $.each(results, function (index, value) {
                                                    var data = value._data;
 
                                                    //TODO grundlegende Änderung, da so keine Sortierung nach Gruppen vorgenommen werden kann.
                                                    //eventuell einfacher alle dokument arten zu laden und mit den gefundenen Dokumentarten zu vergleichen.
                                                    //dann in jeder dokument art beim Klick auf die Art die Dokumente laden
 
                                                    //hole alle Dokumentarten, alphabetisch sortiert.  Wenn Dokumentart in documenttypeslist dann füge hinzu, sonst überspringen
 
                                                    //first get all documenttypes to either the current equipment / other
                                                    //product or one of its lower level items (group, family, platform, product)
 
                                                    //check wheter the ID is in the array allready. if not add it
                                                    if ($.inArray(data.documenttypeFK, documenttypeslist) == -1) {
                                                        documenttypeslist[counter] = data.documenttypeFK;
                                                        counter++;
 
                                                        //create "folder" for this new document type in treeview
                                                        Documenttypes.all()
                                                         .filter("documenttypeId", "=", data.documenttypeFK)
                                                         .order('name', true, false)
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
 
     */

    displayDocumentTypes: function () {
        var $containerRoot = $(documents_CONTAINER),
       $templateFolder = $(documents_FOLDER_TEMPLATE);

        if ($containerRoot.length && $templateFolder.length) {
            //load documents by current url parameter / andhand von aktueller ID laden
            var ProduktgruppePar = utils.getUrlParameter('Produktgruppe');
            var ProduktfamiliePar = utils.getUrlParameter('Produktfamilie');
            var ProduktplatformPar = utils.getUrlParameter('Produktplattform');
            var ProduktPar = utils.getUrlParameter('Produkt');
            var EquipmentProductPar = utils.getUrlParameter('EquipmentProdukt');
            var OtherProductPar = utils.getUrlParameter('SonstigesProdukt');
            var documenttypeslist = []; //store all unique documenttypes
            var counter = 0; //counter to acces documenttype Array

            //if its an equipment page the otherproduct is empty (or the other way around) -  this would cause problems in the SQL query - hence its set to -1)

            if (!EquipmentProductPar) {
                EquipmentProductPar = "-1";
            }
            if (!OtherProductPar) {
                OtherProductPar = "-1";
            }

            Documents.all()
                  .order('documentname', true, false)
                    .list(null, function (results2) {
                        if (results2.length) {
                            //get all types in found documents
                            $.each(results2, function (index, value)
                            {
                                var data = value._data;

                             

                                if (data.equipmentFK == EquipmentProductPar &&
                                    data.productFK == ProduktPar &&
                                    data.productplatformFK == ProduktplatformPar &&
                                    data.productfamilyFK == ProduktfamiliePar &&
                                    data.productgroupFK == ProduktgruppePar ||
                                    data.equipmentFK == 0 &&
                                    data.productFK == ProduktPar &&
                                    data.productplatformFK == ProduktplatformPar &&
                                    data.productfamilyFK == ProduktfamiliePar &&
                                    data.productgroupFK == ProduktgruppePar ||
                                    data.equipmentFK == 0 &&
                                    data.productFK == 0 &&
                                    data.productplatformFK == ProduktplatformPar &&
                                    data.productfamilyFK == ProduktfamiliePar &&
                                    data.productgroupFK == ProduktgruppePar ||
                                    data.equipmentFK == 0 &&
                                    data.productFK == 0 &&
                                    data.productplatformFK == 0 &&
                                    data.productfamilyFK == ProduktfamiliePar &&
                                    data.productgroupFK == ProduktgruppePar ||
                                    data.equipmentFK == 0 &&
                                    data.productFK == 0 &&
                                    data.productplatformFK == 0 &&
                                    data.productfamilyFK == 0 &&
                                    data.productgroupFK == ProduktgruppePar ||
                                    data.equipmentFK == 0 &&
                                    data.productFK == 0 &&
                                    data.productplatformFK == 0 &&
                                    data.productfamilyFK == ProduktfamiliePar &&
                                    data.productgroupFK == 0 ||
                                    data.equipmentFK == 0 &&
                                    data.productFK == 0 &&
                                    data.productplatformFK == ProduktplatformPar &&
                                    data.productfamilyFK == 0 &&
                                    data.productgroupFK == 0 ||
                                    data.equipmentFK == 0 &&
                                    data.productFK == ProduktPar &&
                                    data.productplatformFK == 0 &&
                                    data.productfamilyFK == 0 &&
                                    data.productgroupFK == 0 ||
                                    data.equipmentFK == EquipmentProductPar &&
                                    data.productFK == 0 &&
                                    data.productplatformFK == 0 &&
                                    data.productfamilyFK == 0 &&
                                    data.productgroupFK == 0)
                                {
                                  // console.debug(data);
                                    if ($.inArray(data.documenttypeFK, documenttypeslist) === -1) {
                                        documenttypeslist[counter] = data.documenttypeFK;
                                        counter++;

                                    }
                                }



                              
                                
                            });




                            //get all Documenttypess. Then check if its used in the query for all documents
                            Documenttypes.all()
                            .order('name', true, false)
                            .list(null, function (results) {
                                $.each(results, function (index, value) {
                                    var data = value._data,
                                    newItem;


                                    //check wheter the current documenttyp is in documenttype list. if not skip the creation of an divblock
                                    if ($.inArray(data.documenttypeId, documenttypeslist) === -1) {
                                        return true; //skip in jquery way ;) 
                                    }



                                    newItem = $templateFolder.clone();
                                    newItem.removeAttr('id');
                                    $('.tree-nav-item-name', newItem).html(data.name);
                                    $('.tree-nav-link', newItem).attr("data-item-id", data.documenttypeId);

                                     $containerRoot.append(newItem.removeClass('hidden'));
                                    $containerRoot.removeClass('hidden');

                                });
                            });
                        }
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
               .filter("documenttypeFK", "=", nodeId)
                               .order('documentname', true, false)
           .list(null, function (results) {

               $.each(results, function (index, value) {
                   var data = value._data;

                   if (data.equipmentFK == EquipmentProductPar &&
                                data.productFK == ProduktPar &&
                                data.productplatformFK == ProduktplatformPar &&
                                data.productfamilyFK == ProduktfamiliePar &&
                                data.productgroupFK == ProduktgruppePar ||
                                data.equipmentFK == 0 &&
                                data.productFK == ProduktPar &&
                                data.productplatformFK == ProduktplatformPar &&
                                data.productfamilyFK == ProduktfamiliePar &&
                                data.productgroupFK == ProduktgruppePar ||
                                data.equipmentFK == 0 &&
                                data.productFK == 0 &&
                                data.productplatformFK == ProduktplatformPar &&
                                data.productfamilyFK == ProduktfamiliePar &&
                                data.productgroupFK == ProduktgruppePar ||
                                data.equipmentFK == 0 &&
                                data.productFK == 0 &&
                                data.productplatformFK == 0 &&
                                data.productfamilyFK == ProduktfamiliePar &&
                                data.productgroupFK == ProduktgruppePar ||
                                data.equipmentFK == 0 &&
                                data.productFK == 0 &&
                                data.productplatformFK == 0 &&
                                data.productfamilyFK == 0 &&
                                data.productgroupFK == ProduktgruppePar ||
                                data.equipmentFK == 0 &&
                                data.productFK == 0 &&
                                data.productplatformFK == 0 &&
                                data.productfamilyFK == ProduktfamiliePar &&
                                data.productgroupFK == 0 ||
                                data.equipmentFK == 0 &&
                                data.productFK == 0 &&
                                data.productplatformFK == ProduktplatformPar &&
                                data.productfamilyFK == 0 &&
                                data.productgroupFK == 0 ||
                                data.equipmentFK == 0 &&
                                data.productFK == ProduktPar &&
                                data.productplatformFK == 0 &&
                                data.productfamilyFK == 0 &&
                                data.productgroupFK == 0 ||
                                data.equipmentFK == EquipmentProductPar &&
                                data.productFK == 0 &&
                                data.productplatformFK == 0 &&
                                data.productfamilyFK == 0 &&
                                data.productgroupFK == 0)
                   {
                       var newItem;

                       newItem = $templateItem.clone();


                       newItem.removeAttr('id');

                       $('.tree-nav-item-name', newItem).html(data.documentname);
                       $('.tree-nav-link', newItem).attr("data-item-id", data.documentId);

                       if (data.path) {
                           $('.tree-nav-link', newItem).attr("href", data.path);
                       }

                       container.append(newItem.removeClass('hidden'));
                   }





               });
           });
        }
    }


    //updateDocumentsTree: function (container, nodeId) {
    //    var $templateItem = $(documents_DOCUMENT_TEMPLATE),
    //        $templateFolder = $(documents_FOLDER_TEMPLATE);

    //    var ProduktgruppePar = utils.getUrlParameter('Produktgruppe');
    //    var ProduktfamiliePar = utils.getUrlParameter('Produktfamilie');
    //    var ProduktplatformPar = utils.getUrlParameter('Produktplattform');
    //    var ProduktPar = utils.getUrlParameter('Produkt');
    //    var EquipmentProductPar = utils.getUrlParameter('EquipmentProdukt');

    //    if (container.length && $templateFolder.length && $templateItem.length) {

    //        //now get all documents based on the selected documenttypeID

    //        Documents.all()
    //           .filter("equipmentFK", "=", EquipmentProductPar)
    //           .and(new persistence.PropertyFilter("documenttypeFK", "=", nodeId))
    //           .or(new persistence.AndFilter(new persistence.PropertyFilter("productgroupFK", "=", ProduktgruppePar), new persistence.PropertyFilter("documenttypeFK", "=", nodeId)))
    //           .or(new persistence.AndFilter(new persistence.PropertyFilter("productfamilyFK", "=", ProduktfamiliePar), new persistence.PropertyFilter("documenttypeFK", "=", nodeId)))
    //           .or(new persistence.AndFilter(new persistence.PropertyFilter("productplatformFK", "=", ProduktplatformPar), new persistence.PropertyFilter("documenttypeFK", "=", nodeId)))
    //       .or(new persistence.AndFilter(new persistence.PropertyFilter("productFK", "=", ProduktPar), new persistence.PropertyFilter("documenttypeFK", "=", nodeId)))
    //                .order('documentname', true, false)
    //       .list(null, function (results) {

    //           $.each(results, function (index, value) {
    //               var data = value._data,
    //                   newItem;

    //               if (data.isFolder) {
    //                   newItem = $templateFolder.clone();
    //               } else {
    //                   newItem = $templateItem.clone();
    //               }

    //               newItem.removeAttr('id');

    //               $('.tree-nav-item-name', newItem).html(data.documentname);
    //               $('.tree-nav-link', newItem).attr("data-item-id", data.documentId);

    //               if (data.path) {
    //                   $('.tree-nav-link', newItem).attr("href", data.path);
    //               }

    //               container.append(newItem.removeClass('hidden'));
    //           });
    //       });
    //    }
    //}
};


//bind to sync ready event in order to display the news
$('body').on('documents-sync-ready db-schema-ready', DocumentsUI.displayDocumentTypes);


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
