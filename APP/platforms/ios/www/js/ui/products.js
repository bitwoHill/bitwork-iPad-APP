var products_CONTAINER = "#products-item-container",
    products_EMPTY_CONTAINER = "#products-empty-container",
    products_ITEM_TEMPLATE = "#products-item-template",
    ProduktNames = [];
  

var ProductsUI = {
    resetProducts: function () {
        $(products_CONTAINER + ' > tr').not(products_ITEM_TEMPLATE).remove();
    },

    displayproducts: function () {
        var $container = $(products_CONTAINER),
            $template = $(products_ITEM_TEMPLATE);
console.log("resetproducts");
    ProductsUI.resetProducts();

        if ($container.length && $template.length) {

        
            //load by current url parameter / andhand von aktueller ID laden

            //the products page behaves a little weird. even though we have groups -> families - > platforms ->products -> details the webpart (and hence the app) IGNORES the Product.
            //it shows groups - > families ->plattforms -> all Details of all Products in the platform.

            var ProduktgruppePar = utils.getUrlParameter('Produktgruppe');
            var ProduktfamiliePar = utils.getUrlParameter('Produktfamilie');
            var ProduktplatformPar = utils.getUrlParameter('Produktplattform');
            var counter = 0;
            var ProduktPars = [];
          
            var ProduktPar = "";
            var ProduktName = "";
            var Equipmentcounter;

            //get all Products on the platform and then load all equips or others of the product ...
            Products.all().filter("productplatformFK", "=", ProduktplatformPar).order('product', true, false).list(null, function (results1) {
                //if there are results use them as filter
                if (results1.length) {
                    $(products_EMPTY_CONTAINER).addClass('hidden');
                    //for each product iterate fitting equipments and other products
                    $.each(results1, function (index1, value1) {
                        var data = value1._data;

                        ProduktPars[counter] = data.productid;
                        ProduktNames[counter] = data.product;
                        //  console.debug(ProduktPars[counter]);
                        counter++;

                    });


                    //now we have all productFKs, use them to get equipments and options now
                    for (index = 0; index < ProduktPars.length; ++index) {
                        ProduktPar = ProduktPars[index];
                     
                     
                        //get all equipments
                        EquipmentProducts.all().filter("productFK", "=", ProduktPar).order('productDescription', true, false).list(null, function (results2) {
                            if (results2.length) {
                                //if there are results add them to UI

                                $.each(results2, function (index2, value2) {
                                    //console.debug(ProduktPar);
                                    var data = value2._data;
                                    var $newItem = $template.clone();
                                 
                                  //look for the index of the current Product in ProduktPars 
                      var index = ProduktPars.indexOf(data.productFK);
                      //use the index to find the product name
                      ProduktName = ProduktNames[index];


                                    //formatting of price
                                    var formattedPrice = parseFloat(parseFloat(data.price)).toFixed(2).toLocaleString() + ' €';
                                   
                                    $newItem.removeAttr('id');
                                    $('.products-item-title', $newItem).html(data.productDescription).attr("href", "MPLStammdaten.html?Produktgruppe=" + ProduktgruppePar +
                                        "&Produktfamilie=" + ProduktfamiliePar + "&Produktplattform=" + ProduktplatformPar + "&Produkt=" + data.productFK +
                                         "&ProduktName=" + ProduktName +  "&EquipmentProdukt=" + data.equipmentId);

                                    $('.products-item-piecenumber', $newItem).html(data.pieceNumber).attr("href", "MPLStammdaten.html?Produktgruppe=" + ProduktgruppePar +
                                        "&Produktfamilie=" + ProduktfamiliePar + "&Produktplattform=" + ProduktplatformPar + "&Produkt=" + data.productFK +
                                       "&ProduktName=" + ProduktName +  "&EquipmentProdukt=" + data.equipmentId);

                                    $('.products-item-volume', $newItem).html(data.volume).attr("href", "MPLStammdaten.html?Produktgruppe=" + ProduktgruppePar +
                                        "&Produktfamilie=" + ProduktfamiliePar + "&Produktplattform=" + ProduktplatformPar + "&Produkt=" + data.productFK +
                                       "&ProduktName=" + ProduktName +  "&EquipmentProdukt=" + data.equipmentId);

                                    $('.products-item-price', $newItem).html(formattedPrice).attr("href", "MPLStammdaten.html?Produktgruppe=" +
                                        ProduktgruppePar + "&Produktfamilie=" + ProduktfamiliePar + "&Produktplattform=" + ProduktplatformPar + "&Produkt=" + data.productFK +
                                     "&ProduktName=" + ProduktName +    "&EquipmentProdukt=" + data.equipmentId);

                                    $container.append($newItem.removeClass('hidden'));
                                    Equipmentcounter = 1;
                                });


                            }

                        });
                        // get all Other Products
                        //get all equipments




                        OtherProducts.all().filter("productFK", "=", ProduktPar).order('productDescription', true, false).list(null, function (results) {

                            if (results.length) {
                                
                                $.each(results, function (index, value) {
                                    var data = value._data;
                                    var $newItem = $template.clone();

  var formattedPrice = parseFloat(parseFloat(data.price)).toFixed(2).toLocaleString() + ' €';
                                   

                                    $newItem.removeAttr('id');
                                    $('.products-item-title', $newItem).html(data.productDescription).attr("href", "MPLStammdaten.html?Produktgruppe=" + ProduktgruppePar + "&Produktfamilie=" + ProduktfamiliePar + "&Produktplattform=" + ProduktplatformPar + "&Produkt=" + ProduktPar + "&ProduktName=" + ProduktName +  "&SonstigesProdukt=" + data.otherProductId);
                                    $('.products-item-piecenumber', $newItem).html(data.pieceNumber).attr("href", "MPLStammdaten.html?Produktgruppe=" + ProduktgruppePar + "&Produktfamilie=" + ProduktfamiliePar + "&Produktplattform=" + ProduktplatformPar + "&Produkt=" + ProduktPar + "&ProduktName=" + ProduktName +  "&SonstigesProdukt=" + data.otherProductId);
                                    $('.products-item-price', $newItem).html(formattedPrice).attr("href", "MPLStammdaten.html?Produktgruppe=" + ProduktgruppePar + "&Produktfamilie=" + ProduktfamiliePar + "&Produktplattform=" + ProduktplatformPar + "&Produkt=" + ProduktPar + "&ProduktName=" + ProduktName + "&SonstigesProdukt=" + data.otherProductId);
                                    $('.products-item-volume', $newItem).html(formattedPrice).attr("href", "MPLStammdaten.html?Produktgruppe=" + ProduktgruppePar + "&Produktfamilie=" + ProduktfamiliePar + "&Produktplattform=" + ProduktplatformPar + "&Produkt=" + ProduktPar + "&ProduktName=" + ProduktName + "&SonstigesProdukt=" + data.otherProductId);

                                    //hide volume column
                                    if (!Equipmentcounter) {
                                          $("#products-title-volume").html("Listenpreis");
                                      //  $('.products-item-volume', $newItem).hide();
                                           $("#tableProducts thead tr").each(function () {
                                           $(this).find("th:eq(3)").remove();
                                    });
                                          $("#tableProducts tbody tr").each(function () {
                                           $(this).find("td:eq(3)").remove();
                                    });
                                    
                                    }
                                    $container.append($newItem.removeClass('hidden'));


                                });


                            }
                        });


                    }

                }
            });





        } else {
            $(products_EMPTY_CONTAINER).removeClass('hidden');
        }

        SyncModel.getSyncDate(PRODUCTS_LIST, function (date) {
            //update last sync date
            $('.page-sync-btn-date').html(date);
            $('.page-sync-btn').removeClass('hidden');
        });



    }
};

(function ($) {

    $(document).ready(function () {
        //Display productgroups when sync is ready
        $('body').on(' db-schema-ready equipmentproducts-sync-ready', ProductsUI.displayproducts);


        $('body').on('click', 'a.page-sync-btn', function () {
            var networkState = navigator.connection.type;
          if (networkState != Connection.NONE) {
           
                ProductsModel.sharePointProducts();
            otherproductsModel.sharePointOtherproducts();
            equipmentproductsModel.sharePointEquipmentproducts();
                
                

}
   else {
                alert("Sie sind nicht mit dem Internet verbunden. Der Vorgang wird abgebrochen.");
            }


        });
    });
})(jQuery);
