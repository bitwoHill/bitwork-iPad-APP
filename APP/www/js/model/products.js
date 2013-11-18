//this class does not display any contents of the product database. it only fetches data and filters the productequipment and otherproducts pages
var products_SYNC_URL = "content/products.json",
    products_CONTAINER = "#products-item-container",
    products_ITEM_TEMPLATE = "#products-item-template";

var ProductsUtils = {
    sharePointSync: function (callback) {

        //TODO: replace with sharepoint connection
        $.getJSON(products_SYNC_URL, function (data) {

            $.each(data, function (index, value) {
                var productsItem;

                productsItem = new Products(value);
                persistence.add(productsItem);
            });

            persistence.flush(
                function () {
                    //DB is updated - trigger custom event
                    if (typeof callback === "function") {
                        callback();
                    }

                    $('body').trigger('products-sync-ready');
                }
            );
        }).fail(
            function () {
                //TODO: error handling if necessary
                alert("products: Mock data read error.");

                if (typeof callback === "function") {
                    callback();
                }
            }
        );
    },

    displayproducts: function () {
        var $container = $(products_CONTAINER),
            $template = $(products_ITEM_TEMPLATE);
      

        if ($container.length && $template.length) {
            //load by current url parameter / andhand von aktueller ID laden

            //the products page behaves a little weird. even though we have groups -> families - > platforms ->products -> details the webpart (and hence the app) IGNORES the Product. 
            //it shows groups - > families ->plattforms -> all Details of all Products in the platform.

            var ProduktgruppePar = utils.getUrlParameter('Produktgruppe');
            var ProduktfamiliePar = utils.getUrlParameter('Produktfamilie');
            var ProduktplatformPar = utils.getUrlParameter('Produktplattform');
            var ProduktPar;
            var Equipmentcounter;
            //get all Products on the platform and then load all equips or others of the product ... 
            Products.all().filter("productplatformFK", "=", ProduktplatformPar).list(null, function (results) {
                $.each(results, function (index, value) {

                    var data = value._data;

                    ProduktPar = data.productid;

                    //get all equipments
                    EquipmentProducts.all().filter("productFK", "=", data.productid).list(null, function (results) {
                        $.each(results, function (index, value) {
                            var data = value._data;
                            var $newItem = $template.clone();

                            $newItem.removeAttr('id');
                            $('.products-item-title', $newItem).html(data.productDescription).attr("href", "MPLStammdaten.html?Produktgruppe=" + ProduktgruppePar + "&Produktfamilie=" + ProduktfamiliePar + "&Produktplattform=" + ProduktplatformPar + "&Produkt=" + ProduktPar + "&EquipmentProdukt=" + data.EquipmentId);
                            $('.products-item-piecenumber', $newItem).html(data.pieceNumber);
                            $('.products-item-volume', $newItem).html(data.volume);
                            $('.products-item-price', $newItem).html(data.price);
                            $container.append($newItem.removeClass('hidden'));
                            Equipmentcounter = 1;

                        });
                    });
                    // get all Other Products
                    //get all equipments
                    OtherProducts.all().filter("productFK", "=", data.productid).list(null, function (results) {
                        $.each(results, function (index, value) {
                            var data = value._data;
                            var $newItem = $template.clone();



                            $newItem.removeAttr('id');
                            $('.products-item-title', $newItem).html(data.productDescription).attr("href", "MPLStammdaten.html?Produktgruppe=" + ProduktgruppePar + "&Produktfamilie=" + ProduktfamiliePar + "&Produktplattform=" + ProduktplatformPar + "&Produkt=" + ProduktPar + "&SonstigesProdukt=" + data.OtherProductId);
                            $('.products-item-piecenumber', $newItem).html(data.pieceNumber);
                            $('.products-item-price', $newItem).html(data.price);

                            //hide volume column
                            if (!Equipmentcounter) {
                                $("#products-title-volume").hide();
                                $("#tableProducts tbody tr").each(function () {
                                    $(this).find("td:eq(2)").remove();
                                });
                            }

                            $container.append($newItem.removeClass('hidden'));


                        });
                    });
                });
            });

        }
    }
};

//bind to sync ready event in order to display the products
$('body').on('products-sync-ready', ProductsUtils.displayproducts);