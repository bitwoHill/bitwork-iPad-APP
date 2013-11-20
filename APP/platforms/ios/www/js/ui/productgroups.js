var productgroups_CONTAINER = "#productgroups-items-container",
    productgroups_ITEM_TEMPLATE = "#productgroups-item-template";

var ProductGroupsUI = {
    displayproductgroups: function () {
        var $container = $(productgroups_CONTAINER),
            $template = $(productgroups_ITEM_TEMPLATE);

        if ($container.length && $template.length) {
            Productgroups.all().list(null, function (results) {
                $.each(results, function (index, value) {

                    var data = value._data;
                    var $newItem = $template.clone();

                    $newItem.removeAttr('id');
                    $('.productgroups-item-title', $newItem).html(data.productgroup).attr("href", "MPLProduktfamilien.html?Produktgruppe=" + data.productgroupid);


                    $container.append($newItem.removeClass('hidden'));

                });
            });
        }
    }
};

//bind to sync ready event in order to display the productgroups
$('body').on('productgroups-sync-ready', ProductGroupsUI.displayproductgroups);