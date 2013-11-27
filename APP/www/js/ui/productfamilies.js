var productfamilies_CONTAINER = "#productfamilies-items-container",
    productfamilies_EMPTY_CONTAINER = "#productfamilies-empty-container",
    productfamilies_ITEM_TEMPLATE = "#productfamilies-item-template";

var ProductFamiliesUI = {
    resetProductFamilies : function(){
        $(productfamilies_CONTAINER + ' > div').not(productfamilies_ITEM_TEMPLATE).remove();
    },

    displayproductfamilies: function () 
    {
        var $container = $(productfamilies_CONTAINER),
            $template = $(productfamilies_ITEM_TEMPLATE);

        if ($container.length && $template.length) {
            //load by current url parameter / andhand von aktueller ID laden
            var ProduktgruppePar = utils.getUrlParameter('Produktgruppe');

            Productfamilies.all().filter("productgroupFK", "=", ProduktgruppePar).order('productfamily', true, false).list(null, function (results) {
                ProductFamiliesUI.resetProductFamilies();
                //if there are results add them to UI
                if (results.length) {
                    $(productfamilies_EMPTY_CONTAINER).addClass('hidden');
                    $.each(results, function (index, value) {

                        var data = value._data;
                        var $newItem = $template.clone();

                        $newItem.removeAttr('id');
                        $('.productfamilies-item-title', $newItem).html(data.productfamily).attr("href", "MPLProduktplattformen.html?Produktgruppe=" + ProduktgruppePar + "&Produktfamilie=" + data.productfamilyid);


                        $container.append($newItem.removeClass('hidden'));
                    });

                } else {
                    $(productfamilies_EMPTY_CONTAINER).removeClass('hidden');
                }

            });
        }
            SyncModel.getSyncDate(PRODUCTFAMILIES_LIST, function (date) {
                //update last sync date
                $('.page-sync-btn-date').html(date);
                $('.page-sync-btn').removeClass('hidden');
            });

        }
    };
       
(function ($) {
    //Display productgroups when sync is ready
    $('body').on('productfamilies-sync-ready', ProductFamiliesUI.displayproductfamilies);

    $(document).ready(function () {
        $('body').on('click', 'a.page-sync-btn', function () {
            ProductFamiliesModel.syncProductFamilies();
        });
    })

})(jQuery);