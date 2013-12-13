var equipmentproducts_CONTAINER = "#equipmentproducts-items-container",
MPL_EMPTY_CONTAINER = "#mpl-empty-container",
    localFileSystemRoot;
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


            //Workaround for Search. If Piecenumber Parameter is found, we need to find the IDS for Produkt,family, platform and group first
            var PiecenumberPar = utils.getUrlParameter("Piecenumber");
            if (PiecenumberPar) {
                var neededEquipmentProductID,
                    neededOtherProductID,
                    neededProductFK,
                 neededProductPlatformFK,
                 neededProductFamilyFK,
                 neededProductGroupFK;


                //start digging in Equipments and Other Products
                EquipmentProducts.all().filter("pieceNumber", "=", PiecenumberPar).list(null, function (results) {
                    if (results.length) { //if not check other products
                        $.each(results, function (index, value) {
                            //check products with product FK
                            console.debug(value);
                            neededProductFK = value._data.productFK;
                            neededEquipmentProductID = value._data.equipmentId;

                            console.debug("found Equipment: " + neededEquipmentProductID);
                            console.debug("found Product: " + neededProductFK);

                            if (neededProductFK) //dig further for Platform
                            {
                                Products.all().filter("productid", "=", neededProductFK).list(null, function (results) {
                                    $.each(results, function (index, value) {
                                        //check products with product FK
                                        neededProductPlatformFK = value._data.productplatformFK;
                                        //dig further for Family
                                        if (neededProductPlatformFK) //dig further for Platform
                                        {
                                            console.debug("found Productplatform: " + neededProductPlatformFK);
                                            Productplatforms.all().filter("productplatformid", "=", neededProductPlatformFK).list(null, function (results) {
                                                $.each(results, function (index, value) {
                                                    //check products with product FK
                                                    neededProductFamilyFK = value._data.productfamilyFK;

                                                    //dig further for Group
                                                    if (neededProductFamilyFK) //dig further for Platform
                                                    {
                                                        console.debug("found productfamily: " + neededProductFamilyFK);

                                                        Productfamilies.all().filter("productfamilyid", "=", neededProductFamilyFK).list(null, function (results) {
                                                            $.each(results, function (index, value) {
                                                                //check products with product FK

                                                                neededProductGroupFK = value._data.productgroupFK;
                                                                console.debug("found Productgroup: " + neededProductGroupFK);

                                                                //create new url
                                                                window.location.href = "MPLStammdaten.html?Produktgruppe=" + neededProductGroupFK + "&Produktfamilie=" + neededProductFamilyFK + "&Produktplattform=" + neededProductPlatformFK + "&Produkt=" + neededProductFK + "&EquipmentProdukt=" + neededEquipmentProductID;

                                                            })
                                                        });
                                                    }

                                                })
                                            });
                                        }

                                    })
                                });
                            }
                        })
                    }
                    else { //check other products
                        OtherProducts.all().filter("pieceNumber", "=", PiecenumberPar).list(null, function (results) {
                            $.each(results, function (index, value) {
                                //check products with product FK
                                neededProductFK = value._data.productFK;
                                neededOtherProductID = value._data.otherProductId;
                                console.debug("found Other Product: " + neededOtherProductID);
                                console.debug("found Product: " + neededProductFK);

                                if (neededProductFK) //dig further for Platform
                                {
                                    Products.all().filter("productid", "=", neededProductFK).list(null, function (results) {
                                        $.each(results, function (index, value) {
                                            //check products with product FK
                                            neededProductPlatformFK = value._data.productplatformFK;
                                            //dig further for Family
                                            if (neededProductPlatformFK) //dig further for Platform
                                            {
                                                console.debug("found Productplatform: " + neededProductPlatformFK);
                                                Productplatforms.all().filter("productplatformid", "=", neededProductPlatformFK).list(null, function (results) {
                                                    $.each(results, function (index, value) {
                                                        //check products with product FK
                                                        neededProductFamilyFK = value._data.productfamilyFK;

                                                        //dig further for Group
                                                        if (neededProductFamilyFK) //dig further for Platform
                                                        {
                                                            console.debug("found productfamily: " + neededProductFamilyFK);

                                                            Productfamilies.all().filter("productfamilyid", "=", neededProductFamilyFK).list(null, function (results) {
                                                                $.each(results, function (index, value) {
                                                                    //check products with product FK

                                                                    neededProductGroupFK = value._data.productgroupFK;
                                                                    console.debug("found Productgroup: " + neededProductGroupFK);

                                                                    window.location.href = "MPLStammdaten.html?Produktgruppe=" + neededProductGroupFK + "&Produktfamilie=" + neededProductFamilyFK + "&Produktplattform=" + neededProductPlatformFK + "&Produkt=" + neededProductFK + "&SonstigesProdukt=" + neededOtherProductID;
                                                                })
                                                            });
                                                        }

                                                    })
                                                });
                                            }

                                        })
                                    });
                                }
                            })
                        });
                    }

                });




            }

            //check wheter its found in the equipment table. if not search other products
            if (EquipmentProductPar) {
                EquipmentProducts.all().filter("equipmentId", "=", EquipmentProductPar).list(null, function (results) {
                    $.each(results, function (index, value) {

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
                OtherProducts.all().filter("otherProductId", "=", OtherProductPar).list(null, function (results) {
                    $.each(results, function (index, value) {

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

        SyncModel.getSyncDate(DOCUMENTS_LIST, function (date) {
            //update last sync date
            $('.page-sync-btn-date').html(date);
            $('.page-sync-btn').removeClass('hidden');
        });
    }
};

//bind to sync ready event in order to display the news
$('body').on('equipmentproducts-sync-ready otherproducts-sync-ready db-schema-ready', equipmentproductsUI.displayStammdaten);


//this part is about the options
var productoptions_CONTAINER = "#productoptions-items-container",
    productoptions_ITEM_CHILD_Container = "#productoptions-item-child-container",
    productoptions_ITEM_TEMPLATE = "#productoptions-item-template";

var productoptionsUI = {
    resetOptions: function () {
        $(productoptions_ITEM_CHILD_Container + ' > tr').not(productoptions_ITEM_TEMPLATE).remove();
    },
    displayOptions: function () {
        var $container = $(productoptions_CONTAINER),
            $childcontainer = $(productoptions_ITEM_CHILD_Container),
            $template = $(productoptions_ITEM_TEMPLATE);


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

var documents_CONTAINER = "#document-items-container",
    tree_nav_CONTAINER = "#document-tree-nav-container",
    documents_DOCUMENT_TEMPLATE = "#document-document-item-template",
    documents_FOLDER_TEMPLATE = "#document-folder-item-template";


//displaydata for options in MPL
var DocumentsUI = {
    resetDocuments: function () {
        $(tree_nav_CONTAINER + " > li").not(documents_FOLDER_TEMPLATE).not(documents_DOCUMENT_TEMPLATE).remove();
    },


    displayDocumentTypes: function () {
        var $containerRoot = $(documents_CONTAINER),
            $treeNavContainer = $(tree_nav_CONTAINER),
            $templateFolder = $(documents_FOLDER_TEMPLATE);

        if ($containerRoot.length && $templateFolder.length) {
            DocumentsUI.resetDocuments();
            //get filesystem object to get current app folder. the GUID changes after reinstall or update of app
            try {
                window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
                //  window.requestFileSystem(window.PERSISTENT, 4096 * 1024 * 1024, initFS, errorHandler);
                window.requestFileSystem(window.PERSISTENT, 0, initFS, errorHandler);

            } catch (err) {
                console.debug(err);
            }

            function initFS(fs) {


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

                                $.each(results2, function (index, value) {
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
                                        data.productgroupFK == 0) {
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
                                data.productgroupFK == 0) {
                       var newItem;

                       newItem = $templateItem.clone();


                       newItem.removeAttr('id');

                       $('.tree-nav-item-name', newItem).html(data.documentname);
                       $('.tree-nav-link', newItem).attr("data-item-id", data.documentId);

//create instance of local filesystem if not allready created
if (!localFileSystemRoot)
{

    try{
            window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                function(fileSystem) {
                      localFileSystemRoot = fileSystem.root.fullPath;
                },
                function() {
                     console.debug("could not create filesystem");
                }
            );
        } catch (err) {
           console.debug(err);
        }
}



                       if (data.localPath) {
                           // $('.tree-nav-link', newItem).attr("href", data.path);
                           $('.tree-nav-link', newItem).click(function () { window.open(localFileSystemRoot + "/Dokumente/" + data.localPath, '_blank', 'location=yes'); });
                           console.debug(localFileSystemRoot + "/Dokumente/" + data.localPath);
                         
           
                       }
                       else //show that no file is available
                       {
                           $('.tree-nav-item-name', newItem).html(data.documentname + ' - keine lokale Version verfügbar');
                       }
                       container.append(newItem.removeClass('hidden'));
                   }





               });
           });
        }
    }


};

(function ($) {
    //bind to sync ready event in order to display the news
    $('body').on('documents-sync-ready db-schema-ready', DocumentsUI.displayDocumentTypes);


    $(document).ready(function () {


        $(document).ready(function () {
            $('body').on('click', 'a.page-sync-btn', function () {


                productoptionsModel.sharePointProductOptions();
                documentsModel.sharePointDocuments();

            });
        });


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
})(jQuery);
