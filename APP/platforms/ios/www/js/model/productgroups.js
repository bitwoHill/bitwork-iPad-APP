var productgroups_SYNC_URL = "content/productgroups.json",
    productgroups_CONTAINER = "#productgroups-items-container",
    productgroups_ITEM_TEMPLATE = "#productgroups-item-template";

var ProductGroupsUtils = {
    sharePointSync: function (callback) {

        //TODO: replace with sharepoint connection
        $.getJSON(productgroups_SYNC_URL, function (data) {

            $.each(data, function (index, value) {
                var productgroupsItem;

                productgroupsItem = new Productgroups(value);
                persistence.add(productgroupsItem);
            });

            persistence.flush(
                function () {
                    //DB is updated - trigger custom event
                    if (typeof callback === "function") {
                        callback();
                    }

                    $('body').trigger('productgroups-sync-ready');
                }
            );
        }).fail(
            function () {
                //TODO: error handling if necessary
                alert("Productgroups: Mock data read error.");

                if (typeof callback === "function") {
                    callback();
                }
            }
        );
    },

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
$('body').on('productgroups-sync-ready', ProductGroupsUtils.displayproductgroups);