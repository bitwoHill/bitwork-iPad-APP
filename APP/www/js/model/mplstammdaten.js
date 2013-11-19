var equipmentproducts_SYNC_URL = "content/equipmentproducts.json",
    otherproducts_SYNC_URL = "content/otherproducts.json",
       equipmentproducts_CONTAINER = "#equipmentproducts-items-container";
//create mock data for equipment products
var equipmentproductsUtils = {
    sharePointSync: function (callback) {

        //TODO: replace with sharepoint connection
        $.getJSON(equipmentproducts_SYNC_URL, function (data) {

            $.each(data, function (index, value) {
                var equipmentproductsItem;

                equipmentproductsItem = new EquipmentProducts(value);
                persistence.add(equipmentproductsItem);
            });

            persistence.flush(
                function () {
                    //DB is updated - trigger custom event
                    if (typeof callback === "function") {
                        callback();
                    }

                    $('body').trigger('equipmentproducts-sync-ready');
                }
            );
        }).fail(
            function () {
                //TODO: error handling if necessary
                alert("MPL Stammdaten: Mock data read error.");

                if (typeof callback === "function") {
                    callback();
                }
            }
        );

        //get other OptionProducts
        //TODO: replace with sharepoint connection
        $.getJSON(otherproducts_SYNC_URL, function (data) {

            $.each(data, function (index, value) {
                var otherproductsItem;

                otherproductsItem = new OtherProducts(value);
                persistence.add(otherproductsItem);
            });

            persistence.flush(
                function () {
                    //DB is updated - trigger custom event
                    if (typeof callback === "function") {
                        callback();
                    }

                    $('body').trigger('otherproducts-sync-ready');
                }
            );
        }).fail(
            function () {
                //TODO: error handling if necessary
                alert("MPL Stammdaten otherproducts: Mock data read error.");

                if (typeof callback === "function") {
                    callback();
                }
            }
        );
    },

    //create mockdata for other products


    //create mockdata for options 

    displayStammdaten: function () {
        var $container = $(equipmentproducts_CONTAINER);
        if ($container.length) {

            //load by current url parameter / andhand von aktueller ID laden
            var ProduktgruppePar = utils.getUrlParameter('Produktgruppe');
            var ProduktfamiliePar = utils.getUrlParameter('Produktfamilie');
            var ProduktplatformPar = utils.getUrlParameter('Produktplattform');
            var EquipmentProductPar = utils.getUrlParameter('EquipmentProdukt');
            var OtherProductPar = utils.getUrlParameter('SonstigesProdukt');

            //TODO order by name

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
}
;

//bind to sync ready event in order to display the news
$('body').on('equipmentproducts-sync-ready', equipmentproductsUtils.displayStammdaten).on('otherproducts-sync-ready', equipmentproductsUtils.displayStammdaten);


