var equipmentproducts_CONTAINER = "#equipmentproducts-items-container";

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
                EquipmentProducts.all().filter("EquipmentId", "=", EquipmentProductPar).order().list(null, function (results) {
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
                OtherProducts.all().filter("OtherProductId", "=", OtherProductPar).list(null, function (results) {
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


