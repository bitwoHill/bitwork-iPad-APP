var productgroups_CONTAINER = "#productgroups-items-container",
    productgroups_EMPTY_CONTAINER = "#productgroups-empty-container",
    productgroups_ITEM_TEMPLATE = "#productgroups-item-template";

var ProductGroupsUI = {
    resetProductGroups: function () {
        $(productgroups_CONTAINER + ' > div').not(productgroups_ITEM_TEMPLATE).remove();
    },

    displayproductgroups: function () {
        var $container = $(productgroups_CONTAINER),
            $template = $(productgroups_ITEM_TEMPLATE);

        if ($container.length && $template.length) {
            ProductGroupsUI.resetProductGroups();

            Productgroups.all().order('productgroup', true, false).list(null, function (results) {
                if (results.length) {
                    $(productgroups_EMPTY_CONTAINER).addClass('hidden');
                    $.each(results, function (index, value) {

                        var data = value._data;
                        var $newItem = $template.clone();

                        $newItem.removeAttr('id');
                        $('.productgroups-item-title', $newItem).html(data.productgroup).attr("href", "MPLProduktfamilien.html?Produktgruppe=" + data.productgroupid);


                        $container.append($newItem.removeClass('hidden'));
                    });
                } else {
                    $(productgroups_EMPTY_CONTAINER).removeClass('hidden');
                }

            });
        }

        SyncModel.getSyncDate(PRODUCTGROUPS_LIST, function (date) {
            //update last sync date
            $('.page-sync-btn-date').html(date);
            $('.page-sync-btn').removeClass('hidden');
        });



    }
};

(function ($) {
    //Display productgroups when sync is ready
    $('body').on('productgroups-sync-ready db-schema-ready', ProductGroupsUI.displayproductgroups);

    $(document).ready(function () {
        $('body').on('click', 'a.page-sync-btn', function () {
            ProductGroupsModel.syncProductGroups();
        });
    })

})(jQuery);