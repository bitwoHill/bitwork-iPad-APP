var productfamilies_CONTAINER = "#productfamilies-items-container",
    productfamilies_ITEM_TEMPLATE = "#productfamilies-item-template";

var ProductFamiliesUI = {
    displayproductfamilies: function () {
        var $container = $(productfamilies_CONTAINER),
            $template = $(productfamilies_ITEM_TEMPLATE);

        if ($container.length && $template.length) {
            //load by current url parameter / andhand von aktueller ID laden
            var ProduktgruppePar = utils.getUrlParameter('Produktgruppe');


            Productfamilies.all().filter("productgroupFK", "=", ProduktgruppePar).list(null, function (results) {
                $.each(results, function (index, value) {

                    var data = value._data;
                    var $newItem = $template.clone();

                    $newItem.removeAttr('id');
                    $('.productfamilies-item-title', $newItem).html(data.productfamily).attr("href", "MPLProduktplattformen.html?Produktgruppe="+ ProduktgruppePar + "&Produktfamilie=" + data.productfamilyid);


                    $container.append($newItem.removeClass('hidden'));

                });
            });
        }
    }
};

//bind to sync ready event in order to display the productfamilies
$('body').on('productfamilies-sync-ready', ProductFamiliesUI.displayproductfamilies);