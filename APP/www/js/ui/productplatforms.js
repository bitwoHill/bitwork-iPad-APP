var productplatforms_CONTAINER = "#productplatforms-items-container",
    productplatforms_EMPTY_CONTAINER = "#productplatforms-empty-container",
    productplatforms_ITEM_TEMPLATE = "#productplatforms-item-template";


var ProductPlatformsUI = {
    resetProductPlatforms : function(){
        $(productplatforms_CONTAINER + ' > div').not(productplatforms_ITEM_TEMPLATE).remove();
    },

    displayproductplatforms: function () {
        var $container = $(productplatforms_CONTAINER),
            $template = $(productplatforms_ITEM_TEMPLATE);

        if ($container.length && $template.length) {
            ProductPlatformsUI.resetProductPlatforms();

            //load by current url parameter / andhand von aktueller ID laden
            var ProduktgruppePar = utils.getUrlParameter('Produktgruppe'),
                ProduktfamiliePar = utils.getUrlParameter('Produktfamilie');

            Productplatforms.all().filter("productfamilyFK", "=", ProduktfamiliePar).order('productplatform', true, false).list(null, function (results) {
                //if there are results add them to UI
                if (results.length) {
                    $(productplatforms_EMPTY_CONTAINER).addClass('hidden');
                    $.each(results, function (index, value) {

                        var data = value._data;
                        var $newItem = $template.clone();

                        $newItem.removeAttr('id');
                        $('.productplatforms-item-title', $newItem).html(data.productplatform).attr("href", "MPLProdukt.html?Produktgruppe=" + ProduktgruppePar + "&Produktfamilie=" + ProduktfamiliePar + "&Produktplattform=" + data.productplatformid);


                        $container.append($newItem.removeClass('hidden'));
                    });

                } else {
                    $(productplatforms_EMPTY_CONTAINER).removeClass('hidden');
                }

            });
        }
        SyncModel.getSyncDate(PRODUCTPLATFORMS_LIST, function (date) {
            //update last sync date
            $('.page-sync-btn-date').html(date);
            $('.page-sync-btn').removeClass('hidden');
        });

    }
};

(function ($) {
    //Display productgroups when sync is ready
    $('body').on('productplatforms-sync-ready db-schema-ready', ProductPlatformsUI.displayproductplatforms);

    $(document).ready(function () {
        $('body').on('click', 'a.page-sync-btn', function () {
            ProductPlatformsModel.sharePointPlatforms();
        });
    })

})(jQuery);
