var products_CONTAINER = "#products-item-container",
    products_EMPTY_CONTAINER = "#products-empty-container",
    products_ITEM_TEMPLATE = "#products-item-template";

var ProductsUI = {
    resetProducts : function(){
        $(products_CONTAINER + ' > tr').not(products_ITEM_TEMPLATE).remove();
    },

    displayproducts: function () {
        var $container = $(products_CONTAINER),
            $template = $(products_ITEM_TEMPLATE);


        if ($container.length && $template.length) {

            ProductsUI.resetProducts();

            //load by current url parameter / andhand von aktueller ID laden

            //the products page behaves a little weird. even though we have groups -> families - > platforms ->products -> details the webpart (and hence the app) IGNORES the Product.
            //it shows groups - > families ->plattforms -> all Details of all Products in the platform.

            var ProduktgruppePar = utils.getUrlParameter('Produktgruppe');
            var ProduktfamiliePar = utils.getUrlParameter('Produktfamilie');
            var ProduktplatformPar = utils.getUrlParameter('Produktplattform');
            var counter = 0;
            var ProduktPars = [];
            var ProduktPar = "";
            var Equipmentcounter;

            //get all Products on the platform and then load all equips or others of the product ...
            Products.all().filter("productplatformFK", "=", ProduktplatformPar).order('product', true, false).list(null, function (results1) {
                //if there are results use them as filter
                if (results1.length) {
                    $(products_EMPTY_CONTAINER).addClass('hidden');
                    //for each product iterate fitting equipments and other products
                    $.each(results1, function (index1, value1)
                    {
                        var data = value1._data;

                        ProduktPars[counter] = data.productid;
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
                                    $newItem.removeAttr('id');
                                    $('.products-item-title', $newItem).html(data.productDescription).attr("href", "MPLStammdaten.html?Produktgruppe=" + ProduktgruppePar + "&Produktfamilie=" + ProduktfamiliePar + "&Produktplattform=" + ProduktplatformPar + "&Produkt=" + data.productFK + "&EquipmentProdukt=" + data.equipmentId);
                                    $('.products-item-piecenumber', $newItem).html(data.pieceNumber).attr("href", "MPLStammdaten.html?Produktgruppe=" + ProduktgruppePar + "&Produktfamilie=" + ProduktfamiliePar + "&Produktplattform=" + ProduktplatformPar + "&Produkt=" + data.productFK + "&EquipmentProdukt=" + data.equipmentId);
                                    $('.products-item-volume', $newItem).html(data.volume).attr("href", "MPLStammdaten.html?Produktgruppe=" + ProduktgruppePar + "&Produktfamilie=" + ProduktfamiliePar + "&Produktplattform=" + ProduktplatformPar + "&Produkt=" + data.productFK + "&EquipmentProdukt=" + data.equipmentId);
                                    $('.products-item-price', $newItem).html(parseFloat(parseFloat(data.price)).toFixed(2).toLocaleString() + ' €').attr("href", "MPLStammdaten.html?Produktgruppe=" + ProduktgruppePar + "&Produktfamilie=" + ProduktfamiliePar + "&Produktplattform=" + ProduktplatformPar + "&Produkt=" + data.productFK + "&EquipmentProdukt=" + data.equipmentId);
                                    $container.append($newItem.removeClass('hidden'));
                                    Equipmentcounter = 1;
                                });


                            }

                        });
                        // get all Other Products
                        //get all equipments



                        OtherProducts.all().filter("productFK", "=", ProduktPar).order('productDescription', true, false).list(null, function (results) {

                            if (results.length) {
                                $container.append($newItem.removeClass('hidden'));

                                $.each(results, function (index, value) {
                                    var data = value._data;
                                    var $newItem = $template.clone();



                                    $newItem.removeAttr('id');
                                    $('.products-item-title', $newItem).html(data.productDescription).attr("href", "MPLStammdaten.html?Produktgruppe=" + ProduktgruppePar + "&Produktfamilie=" + ProduktfamiliePar + "&Produktplattform=" + ProduktplatformPar + "&Produkt=" + ProduktPar + "&SonstigesProdukt=" + data.otherProductId);
                                    $('.products-item-piecenumber', $newItem).html(data.pieceNumber);
                                    $('.products-item-price', $newItem).html( parseFloat(data.price).toFixed(2).toLocaleString() + ' €');
                                 
                                    //hide volume column
                                    if (!Equipmentcounter) {
                                        $("#products-title-volume").hide();
                                        $("#tableProducts tbody tr").each(function () {
                                            $(this).find("td:eq(2)").remove();
                                        });
                                    }
                                    $container.append($newItem.removeClass('hidden'));


                                });


                            }
                        });


                    }

                }
            });



                       

        } else
        {
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
    //Display productgroups when sync is ready
    $('body').on('products-sync-ready db-schema-ready', ProductsUI.displayproducts);

    $(document).ready(function () {
        $('body').on('click', 'a.page-sync-btn', function () {
            equipmentproductsModel.sharePointEquipmentproducts();
            otherproductsModel.sharePointOtherproducts();
            ProductsModel.sharePointProducts();
           });
    });
})(jQuery);
