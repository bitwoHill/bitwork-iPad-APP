var equipmentproducts_CONTAINER = "#equipmentproducts-items-container", MPL_EMPTY_CONTAINER = "#mpl-empty-container", localFileSystemRoot;

var documents_CONTAINER = "#document-items-container", tree_nav_CONTAINER = "#document-tree-nav-container", documents_DOCUMENT_TEMPLATE = "#document-document-item-template", documents_FOLDER_TEMPLATE = "#document-folder-item-template";

var productoptions_CONTAINER = "#productoptions-items-container", productoptions_ITEM_CHILD_Container = "#productoptions-item-child-container", productoptions_ITEM_TEMPLATE = "#productoptions-item-template";

//MPLstammdaten.js combines the data from equipmentproducts, otherprodcuts, documents, documenttypes and product options for mplstammdaten.html

//create mock data for equipment products
var equipmentproductsUI = {

    displayStammdaten : function() {

        //disable drawing of dialog as it will be reloaded anyway

        var $container = $(equipmentproducts_CONTAINER);
        if ($container.length) {

            //hide optional fields
            $(documents_CONTAINER).addClass('hidden');
            $(productoptions_CONTAINER).addClass('hidden');

            //load by current url parameter / andhand von aktueller ID laden
            var EquipmentProductPar = utils.getUrlParameter('EquipmentProdukt');
            var OtherProductPar = utils.getUrlParameter('SonstigesProdukt');

            //Workaround for Search. If Piecenumber Parameter is found, we need to find the IDS for Produkt,family, platform and group first
            var PiecenumberPar = utils.getUrlParameter("Piecenumber");
            var SearchPar = utils.getUrlParameter("SearchPar");

            if (PiecenumberPar && SearchPar) {

                var neededEquipmentProductID, neededOtherProductID, neededProductFK, neededProductPlatformFK, neededProductFamilyFK, neededProductGroupFK;

                //start digging in Equipments and Other Products
                EquipmentProducts.all().filter("pieceNumber", "=", PiecenumberPar).list(null, function(results) {
                    if (results.length) {//if not check other products
                        $.each(results, function(index, value) {
                            //check products with product FK
                            // console.debug(value);
                            neededProductFK = value._data.productFK;
                            neededEquipmentProductID = value._data.equipmentId;
                            EquipmentProductPar = neededEquipmentProductID;
                          //  console.debug("found Equipment: " + neededEquipmentProductID);
                            //   console.debug("found Product: " + neededProductFK);

                            if (neededProductFK)//dig further for Platform
                            {
                                Products.all().filter("productid", "=", neededProductFK).list(null, function(results) {
                                    $.each(results, function(index, value) {
                                        //check products with product FK
                                        neededProductPlatformFK = value._data.productplatformFK;
                                        //dig further for Family
                                        if (neededProductPlatformFK)//dig further for Platform
                                        {
                                           //    console.debug("found Productplatform: " + neededProductPlatformFK);
                                            Productplatforms.all().filter("productplatformid", "=", neededProductPlatformFK).list(null, function(results) {
                                                $.each(results, function(index, value) {
                                                    //check products with product FK
                                                    neededProductFamilyFK = value._data.productfamilyFK;

                                                    //dig further for Group
                                                    if (neededProductFamilyFK)//dig further for Platform
                                                    {
                                                 //          console.debug("found productfamily: " + neededProductFamilyFK);

                                                        Productfamilies.all().filter("productfamilyid", "=", neededProductFamilyFK).list(null, function(results) {
                                                            $.each(results, function(index, value) {
                                                                //check products with product FK

                                                                neededProductGroupFK = value._data.productgroupFK;
                                                               //    console.debug("found Productgroup: " + neededProductGroupFK);

                                                                //create new url
                                                                window.location.href = "MPLStammdaten.html?Produktgruppe=" + neededProductGroupFK + "&Produktfamilie=" + neededProductFamilyFK + "&Produktplattform=" + neededProductPlatformFK + "&Produkt=" + neededProductFK + "&EquipmentProdukt=" + neededEquipmentProductID + "&SearchPar=" + SearchPar;
                                                                return;
                                                            });
                                                        });
                                                    }

                                                });
                                            });
                                        }

                                    });
                                });
                            }
                        });
                    } else {//check other products
                        OtherProducts.all().filter("pieceNumber", "=", PiecenumberPar).list(null, function(results) {
                            $.each(results, function(index, value) {
                                //check products with product FK
                                neededProductFK = value._data.productFK;
                                neededOtherProductID = value._data.otherProductId;
                                OtherProductPar = neededOtherProductID;
                             //      console.debug("found Other Product: " + neededOtherProductID);
                             //      console.debug("found Product: " + neededProductFK);

                                if (neededProductFK)//dig further for Platform
                                {
                                    Products.all().filter("productid", "=", neededProductFK).list(null, function(results) {
                                        $.each(results, function(index, value) {
                                            //check products with product FK
                                            neededProductPlatformFK = value._data.productplatformFK;
                                            //dig further for Family
                                            if (neededProductPlatformFK)//dig further for Platform
                                            {
                                                console.debug("found Productplatform: " + neededProductPlatformFK);
                                                Productplatforms.all().filter("productplatformid", "=", neededProductPlatformFK).list(null, function(results) {
                                                    $.each(results, function(index, value) {
                                                        //check products with product FK
                                                        neededProductFamilyFK = value._data.productfamilyFK;

                                                        //dig further for Group
                                                        if (neededProductFamilyFK)//dig further for Platform
                                                        {
                                                          //     console.debug("found productfamily: " + neededProductFamilyFK);

                                                            Productfamilies.all().filter("productfamilyid", "=", neededProductFamilyFK).list(null, function(results) {
                                                                $.each(results, function(index, value) {
                                                                    //check products with product FK

                                                                    neededProductGroupFK = value._data.productgroupFK;
                                                              //         console.debug("found Productgroup: " + neededProductGroupFK);

                                                                    window.location.href = "MPLStammdaten.html?Produktgruppe=" + neededProductGroupFK + "&Produktfamilie=" + neededProductFamilyFK + "&Produktplattform=" + neededProductPlatformFK + "&Produkt=" + neededProductFK + "&SonstigesProdukt=" + neededOtherProductID + "&SearchPar=" + SearchPar;
                                                                    return;
                                                                });
                                                            });
                                                        }

                                                    });
                                                });
                                            }

                                        });
                                    });
                                }
                            });
                        });
                    }

                });

            } else {
                //enable drawing of dialog. Doing it here removes flickering if opened from search
                $("#ContentMPL").removeClass('hidden');

                //change navigate backwards button if search parameter was passed
                if (SearchPar) {
                    //show navigate backwardsbutton for search if site was opened from search (requestParam exists)
                    $('#btnNavigateBackwardsSearch').removeClass('hidden');
                    $('#btnNavigateBackwards').addClass('hidden');
                    //change backwardsbuttonsearch to Search.html. This step is needed as a browser history back would lead to a loop.
                    //Search openes MPLStammdaten with a different Parameter then MPLProdukt.
                    var link = $('#btnNavigateBackwardsSearch').attr('href') + SearchPar;
                    $('#btnNavigateBackwardsSearch').attr('href', link);
                }

                //check wheter its found in the equipment table. if not search other products

                if (EquipmentProductPar) {
                    EquipmentProducts.all().filter("equipmentId", "=", EquipmentProductPar).list(null, function(results) {
                        $.each(results, function(index, value) {

                            var data = value._data;

                            document.getElementById("valueProductDescription").innerHTML = data.productDescription;
                            document.getElementById("valuePiecenumber").innerHTML = data.pieceNumber;
                            document.getElementById("valuePrice").innerHTML = parseFloat(data.price).toFixed(2).toLocaleString() + ' €';
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
                    OtherProducts.all().filter("otherProductId", "=", OtherProductPar).list(null, function(results) {
                        $.each(results, function(index, value) {

                            var data = value._data;
                            document.getElementById("valueProductDescription").innerHTML = data.productDescription;
                            document.getElementById("valuePiecenumber").innerHTML = data.pieceNumber;
                            document.getElementById("valuePrice").innerHTML = parseFloat(data.price).toFixed(2).toLocaleString() + ' €';
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

        SyncModel.getSyncDate(DOCUMENTS_LIST, function(date) {
            //update last sync date
            $('.page-sync-btn-date').html(date);
            $('.page-sync-btn').removeClass('hidden');
        });
    }
};

//bind to sync ready event in order to display the news
$('body').on('equipmentproducts-sync-ready otherproducts-sync-ready db-schema-ready', equipmentproductsUI.displayStammdaten);

//this part is about the options

var productoptionsUI = {
    resetOptions : function() {
        $(productoptions_ITEM_CHILD_Container + ' > tr').not(productoptions_ITEM_TEMPLATE).remove();
    },
    displayOptions : function() {
        var $container = $(productoptions_CONTAINER), $childcontainer = $(productoptions_ITEM_CHILD_Container), $template = $(productoptions_ITEM_TEMPLATE);

        if ($container.length && $template.length) {
            productoptionsUI.resetOptions();
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


//Change TH: The SharePoint Lookupfields are set to Multichoice instead of single lookup. The Database stores the FKs as _ID; Hence the Produktpars need to be tweaked, to be used in a contain query
ProduktgruppePar =    "%" + "_" +  ProduktgruppePar  + ";"     + "%";
ProduktfamiliePar =   "%" +"_" +  ProduktfamiliePar + ";" + "%";
ProduktplatformPar =  "%" +"_" +  ProduktplatformPar + ";" + "%";
ProduktPar =          "%" +"_" +  ProduktPar  + ";" + "%";
EquipmentProductPar = "%" +"_" +  EquipmentProductPar + ";" + "%";
OtherProductPar =     "%" +"_" +  OtherProductPar  + ";" + "%";

  // console.log(ProduktgruppePar );
  // console.log(ProduktfamiliePar );
  // console.log(ProduktplatformPar );
  // console.log(ProduktPar       );
  // console.log(EquipmentProductPar );
  // console.log(OtherProductPar );

            //check wheter there is an option to either the current equipment / other product or one of its lower level items (group, family, platform, product)
            ProductOptions.all().filter("equipmentFK", "LIKE", EquipmentProductPar).or(new persistence.PropertyFilter("productgroupFK", "LIKE", ProduktgruppePar)).or(new persistence.PropertyFilter("productfamilyFK", "LIKE", ProduktfamiliePar)).or(new persistence.PropertyFilter("productplatformFK", "LIKE", ProduktplatformPar)).or(new persistence.PropertyFilter("productFK", "LIKE", ProduktPar)).order('productDescription', true, false).list(null, function(results) {
  // console.log(results);
                if (results.length != 0) {
                    $container.removeClass('hidden');
                }

                $.each(results, function(index, value) {

                    var data = value._data;




                    var $newItem = $template.clone();
                    $newItem.removeAttr('id');
                    $('.productoption-item-optionsbezeichnung', $newItem).html(data.productDescription);
                    $('.productoption-item-teilenummer', $newItem).html(data.pieceNumber);
                    $('.productoption-item-listenpreis', $newItem).html(parseFloat(data.price).toFixed(2).toLocaleString() + ' €');
                    $childcontainer.append($newItem.removeClass('hidden'));

                });
            });
        }
    }
};

//bind to sync ready event in order to display the news
$('body').on('productoptions-sync-ready db-schema-ready', productoptionsUI.displayOptions);

//this part is about the documents

//displaydata for options in MPL
var DocumentsUI = {
    resetDocuments : function() {
        $(tree_nav_CONTAINER + " > li").not(documents_FOLDER_TEMPLATE).not(documents_DOCUMENT_TEMPLATE).remove();
    },

    displayDocumentTypes : function() {
        console.debug("hole sync date");
        SyncModel.getSyncDate(DOCUMENTS_LIST, function(date) {
            //update last sync date
         //      console.debug("date");

            $('.page-sync-btn-date').html(date);
            $('.page-sync-btn').removeClass('hidden');
        });

        var $containerRoot = $(documents_CONTAINER), $treeNavContainer = $(tree_nav_CONTAINER), $templateFolder = $(documents_FOLDER_TEMPLATE);

        if ($containerRoot.length && $templateFolder.length) {
            DocumentsUI.resetDocuments();
            //get filesystem object to get current app folder. the GUID changes after reinstall or update of app
            try {
                console.log("try opening filesystem");
                window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
                //  window.requestFileSystem(window.PERSISTENT, 4096 * 1024 * 1024, initFS, errorHandler);
                window.requestFileSystem(window.PERSISTENT, 0, initFS, errorHandler);
                console.log("sucess fs");

            } catch (err) {
                console.debug(err);
            }

            function initFS(fs) {

                console.log("opened filesystem");
                //load documents by current url parameter / andhand von aktueller ID laden

                var ProduktgruppePar = utils.getUrlParameter('Produktgruppe');
                var ProduktfamiliePar = utils.getUrlParameter('Produktfamilie');
                var ProduktplatformPar = utils.getUrlParameter('Produktplattform');
                var ProduktPar = utils.getUrlParameter('Produkt');
                var ProduktNamePar = utils.getUrlParameter('ProduktName');
                var EquipmentProductPar = utils.getUrlParameter('EquipmentProdukt');
                var OtherProductPar = utils.getUrlParameter('SonstigesProdukt');
                var documenttypeslist = [];
                //store all unique documenttypes
                var counter = 0;
                //counter to acces documenttype Array

                //if its an equipment page the otherproduct is empty (or the other way around) -  this would cause problems in the SQL query - hence its set to -1)
if (!OtherProductPar) {
                    OtherProductPar = "-1";
                }
                else
                { //reasign the equipemnt, if an otherproduct was found
                	EquipmentProductPar = OtherProductPar;
                }
                if (!EquipmentProductPar) {
                    EquipmentProductPar = "-1";
                }
                

                Documents.all().order('documentname', true, false).list(null, function(results2) {
                    if (results2.length) {
                        //get all types in found documents
                     //   console.log("found documents");
  // console.log("Documenttypes");
   // console.debug("Produktgruppe:" + ProduktgruppePar);
    //       console.debug("ProduktfamiliePar:" + ProduktfamiliePar);
    //       console.debug("ProduktplatformPar:" + ProduktplatformPar);
    //       console.debug("ProduktPar:" + ProduktPar);
   //        console.debug("ProduktNamePar:" + ProduktNamePar);
    //       console.debug("EquipmentProductPar:" + EquipmentProductPar);
   // console.debug("OtherProductPar:" + OtherProductPar);

                        $.each(results2, function(index, value) {
                            var data = value._data;


//Aufbrechen der FK Strings, da diese durch ; getrennt sind


//search if ; seperated FKs contain needed FK
if (data.equipmentFK.search("_" + EquipmentProductPar + ";") >= 0)
data.equipmentFK = EquipmentProductPar;

//search if ; seperated FKs contain needed FK
if (data.productFK.search("_" + ProduktPar + ";") >= 0)
data.productFK = ProduktPar;

//search if ; seperated FKs contain needed FK
if (data.productfamilyFK.search("_" + ProduktfamiliePar + ";") >= 0)
data.productfamilyFK = ProduktfamiliePar;

//search if ; seperated FKs contain needed FK
if (data.productgroupFK.search("_" + ProduktgruppePar + ";") >= 0)
data.productgroupFK = ProduktgruppePar;

//search if ; seperated FKs contain needed FK
if (data.productplatformFK.search("_" + ProduktplatformPar + ";") >= 0)
data.productplatformFK = ProduktplatformPar;


                            if (data.equipmentFK == EquipmentProductPar && data.productFK == ProduktPar && data.productplatformFK == ProduktplatformPar && data.productfamilyFK == ProduktfamiliePar && data.productgroupFK == ProduktgruppePar || 
                                data.equipmentFK == 0 && data.productFK == ProduktPar && data.productplatformFK == ProduktplatformPar && data.productfamilyFK == ProduktfamiliePar && data.productgroupFK == ProduktgruppePar || 
                                data.equipmentFK == 0 && data.productFK == 0 && data.productplatformFK == ProduktplatformPar && data.productfamilyFK == ProduktfamiliePar && data.productgroupFK == ProduktgruppePar || 
                                data.equipmentFK == 0 && data.productFK == 0 && data.productplatformFK == 0 && data.productfamilyFK == ProduktfamiliePar && data.productgroupFK == ProduktgruppePar || 
                                data.equipmentFK == 0 && data.productFK == 0 && data.productplatformFK == 0 && data.productfamilyFK == 0 && data.productgroupFK == ProduktgruppePar || 
                                data.equipmentFK == 0 && data.productFK == 0 && data.productplatformFK == 0 && data.productfamilyFK == ProduktfamiliePar && data.productgroupFK == 0 || 
                                data.equipmentFK == 0 && data.productFK == 0 && data.productplatformFK == ProduktplatformPar && data.productfamilyFK == 0 && data.productgroupFK == 0 || 
                                data.equipmentFK == 0 && data.productFK == ProduktPar && data.productplatformFK == 0 && data.productfamilyFK == 0 && data.productgroupFK == 0 || 
                                data.equipmentFK == EquipmentProductPar && data.productFK == 0 && data.productplatformFK == 0 && data.productfamilyFK == 0 && data.productgroupFK == 0) {
                                
                             //       console.log(data);
                                if ($.inArray(data.documenttypeFK, documenttypeslist) === -1) {
                                    documenttypeslist[counter] = data.documenttypeFK;
                                    counter++;

                                }
                            }

                        });

                        //WORKAROUND

                        //check if perhaps the name matches
                        //filter Database based on ID of SP Item
                        Products.all().filter("product", "=", ProduktNamePar).list(null, function(results3) {
                            if (results3.length) {
                                //get all types in found documents
                                console.log("found documenttype by name");
                                $.each(results3, function(index, value) {
                                    var data = value._data;

                                    if ($.inArray(data.documenttypeFK, documenttypeslist) === -1) {
                                        documenttypeslist[counter] = data.documenttypeFK;
                                        counter++;

                                    }
                                });
                            }
                        });

                        //get all Documenttypess. Then check if its used in the query for all documents
                        Documenttypes.all().order('name', true, false).list(null, function(results) {
                            $.each(results, function(index, value) {
                                var data = value._data, newItem;

                                //check wheter the current documenttype is in documenttype list. if not skip the creation of an divblock
                                if ($.inArray(data.documenttypeId, documenttypeslist) === -1) {
                                    return true;
                                    //skip in jquery way ;)
                                }

                                newItem = $templateFolder.clone();
                                newItem.removeAttr('id');
                                $('.tree-nav-item-name', newItem).html(data.name);
                                $('.tree-nav-link', newItem).attr("data-item-id", data.documenttypeId);

                                $treeNavContainer.append(newItem.removeClass('hidden'));
                                $containerRoot.removeClass('hidden');

                            });
                        });
                    }
                });

            }

            function errorHandler() {
                console.debug('An error occured');
                alert("Could not create Filesystem. Not enough Local Storage available");
                download.reject();
            }

        }
    },

    updateDocumentsTree : function(container, nodeId) {
        var $templateItem = $(documents_DOCUMENT_TEMPLATE), $templateFolder = $(documents_FOLDER_TEMPLATE);

        var ProduktgruppePar = utils.getUrlParameter('Produktgruppe');
        var ProduktfamiliePar = utils.getUrlParameter('Produktfamilie');
        var ProduktplatformPar = utils.getUrlParameter('Produktplattform');
        var ProduktPar = utils.getUrlParameter('Produkt');
       // var ProduktAlternativeID = -1;
        var ProduktAlternativeID = new Array();

        var ProduktNamePar = utils.getUrlParameter('ProduktName');
        var EquipmentProductPar = utils.getUrlParameter('EquipmentProdukt');
          var OtherProductPar = utils.getUrlParameter('SonstigesProdukt');

     //      console.debug("Produktgruppe:" + ProduktgruppePar);
     //      console.debug("ProduktfamiliePar:" + ProduktfamiliePar);
      //     console.debug("ProduktplatformPar:" + ProduktplatformPar);
     //      console.debug("ProduktPar:" + ProduktPar);
     //      console.debug("ProduktNamePar:" + ProduktNamePar);
       //    console.debug("EquipmentProductPar:" + EquipmentProductPar);
  //  console.debug("OtherProductPar:" + OtherProductPar);

if (!OtherProductPar) {
                    OtherProductPar = "-1";
                }
                else
                { //reasign the equipemnt, if an otherproduct was found
                	EquipmentProductPar = OtherProductPar;
                }
                if (!EquipmentProductPar) {
                    EquipmentProductPar = "-1";
                }
                
        if (container.length && $templateFolder.length && $templateItem.length) {

            //check if there is a associated product which "exists" two times = two different products but same name => add as well
            Products.all().filter("product", "=", ProduktNamePar).list(null, function(results3) {
           //        console.log(results3);
                if (results3.length) {
                    //get all types in found documents
                    console.log("found products by parameter");
                    $.each(results3, function(index, value2) {

                        var data = value2._data;
                        // Skip the product with allready used ID. hence get only the products which are not associated but happen to have the same name
                        if (data.productid != ProduktPar) {
                     
                            ProduktAlternativeID.push(data.productid);

                            console.log("found alternative ProduktAlternativeID 1 " + ProduktAlternativeID);
                        }

                    });
                }



 //now get all documents based on the selected documenttypeID
            Documents.all().filter("documenttypeFK", "=", nodeId).order('documentname', true, false).list(null, function(results) {

                $.each(results, function(index, value) {
                    var data = value._data;

         
                    if (data.equipmentFK == EquipmentProductPar && data.productFK == ProduktPar && data.productplatformFK == ProduktplatformPar && data.productfamilyFK == ProduktfamiliePar && data.productgroupFK == ProduktgruppePar || 
                        data.equipmentFK == 0 && data.productFK == ProduktPar && data.productplatformFK == ProduktplatformPar && data.productfamilyFK == ProduktfamiliePar && data.productgroupFK == ProduktgruppePar || 
                        data.equipmentFK == 0 && data.productFK == 0 && data.productplatformFK == ProduktplatformPar && data.productfamilyFK == ProduktfamiliePar && data.productgroupFK == ProduktgruppePar || 
                        data.equipmentFK == 0 && data.productFK == 0 && data.productplatformFK == 0 && data.productfamilyFK == ProduktfamiliePar && data.productgroupFK == ProduktgruppePar || 
                        data.equipmentFK == 0 && data.productFK == 0 && data.productplatformFK == 0 && data.productfamilyFK == 0 && data.productgroupFK == ProduktgruppePar || 
                        data.equipmentFK == 0 && data.productFK == 0 && data.productplatformFK == 0 && data.productfamilyFK == ProduktfamiliePar && data.productgroupFK == 0 || 
                        data.equipmentFK == 0 && data.productFK == 0 && data.productplatformFK == ProduktplatformPar && data.productfamilyFK == 0 && data.productgroupFK == 0 || 
                        data.equipmentFK == 0 && data.productFK == ProduktPar && data.productplatformFK == 0 && data.productfamilyFK == 0 && data.productgroupFK == 0 ||
                         data.equipmentFK == EquipmentProductPar && data.productFK == 0 && data.productplatformFK == 0 && data.productfamilyFK == 0 && data.productgroupFK == 0 || 
                     $.inArray(data.productFK,ProduktAlternativeID) != -1 || 
                         data.productFK == ProduktPar ) {
                        var newItem;

                        newItem = $templateItem.clone();

                        newItem.removeAttr('id');

                        $('.tree-nav-item-name', newItem).html(data.documentname);
                        $('.tree-nav-link', newItem).attr("data-item-id", data.documentId);

                        //create instance of local filesystem if not allready created
                        if (!localFileSystemRoot) {

                            try {
                                window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

                                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                                    localFileSystemRoot = fileSystem.root.toURL();
                                }, function() {
                                    console.debug("could not create filesystem");
                                });
                            } catch (err) {
                                console.debug(err);
                            }
                        }

                        if (data.localPath) {
                            // $('.tree-nav-link', newItem).attr("href", data.path);
                            $('.tree-nav-link', newItem).click(function() {
                                LaunchFile('file://' + localFileSystemRoot + "/Dokumente/" + data.localPath);
                            });
                            console.debug(localFileSystemRoot + "/Dokumente/" + data.localPath);

                        } else//show that no file is available
                        {
                            //Set Link to Online File. If the file was downloaded itll be changed to the local path

                            $('.tree-nav-item-name', newItem).html(data.documentname + ' <span class="label label-default"> Nicht Heruntergeladen</span>');
                                  $('.tree-nav-link', newItem).attr('href', 'http://www.atlas-cms.com' + data.path);
                        }
                        container.append(newItem.removeClass('hidden'));
                    }

                });
            });



            });

           
        }
    }
};

(function($) {
    //bind to sync ready event in order to display the news
    $('body').on('documents-sync-ready db-schema-ready', DocumentsUI.displayDocumentTypes);

    $(document).ready(function() {

        $(document).ready(function() {
            $('body').on('click', 'a.page-sync-btn', function() {

                var networkState = navigator.connection.type;
                if (networkState != Connection.NONE) {
                    productoptionsModel.sharePointProductOptions();

                    documentsModel.syncSharePointDocumentsWithoutDelete();
                } else {
                    alert("Sie sind nicht mit dem Internet verbunden. Der Vorgang wird abgebrochen.");
                }

            });
        });

        $('body').on('click', '.tree-nav-link.folder', function(e) {
            e.preventDefault();
            var $this = $(this), nodeId = $this.attr("data-item-id"), container = $this.siblings("ul.tree-nav"), $icon = $('.fa', $this);

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

         $('body').on('sync-error', function(e) {
          alert("Es gab einen Fehler beim synchronisieren. Versuchen Sie es später erneut.");
           $('body').trigger('sync-end');
                    $('body').trigger('documents-sync-ready');
        });
    });
})(jQuery);
