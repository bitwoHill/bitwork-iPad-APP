var productplatforms_CONTAINER = "#productplatforms-items-container",
    productplatforms_ITEM_TEMPLATE = "#productplatforms-item-template";

var ProductPlatformsUI = {
    displayproductplatforms: function () {
        var $container = $(productplatforms_CONTAINER),
            $template = $(productplatforms_ITEM_TEMPLATE);

        if ($container.length && $template.length) {

            //load by current url parameter / andhand von aktueller ID laden
            var ProduktgruppePar = utils.getUrlParameter('Produktgruppe');
            var ProduktfamiliePar = utils.getUrlParameter('Produktfamilie');

            Productplatforms.all().filter("productfamilyFK", "=", ProduktfamiliePar).list(null, function (results) {
                $.each(results, function (index, value) {

                    var data = value._data;
                    var $newItem = $template.clone();

                    $newItem.removeAttr('id');
                    $('.productplatforms-item-title', $newItem).html(data.productplatform).attr("href", "MPLProdukt.html?Produktgruppe="+ ProduktgruppePar + "&Produktfamilie=" +  ProduktfamiliePar+ "&Produktplattform=" + data.productplatformid);


                    $container.append($newItem.removeClass('hidden'));

                });
            });
        }
    }
};

//bind to sync ready event in order to display the productplatforms
$('body').on('productplatforms-sync-ready', ProductPlatformsUI.displayproductplatforms);