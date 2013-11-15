var productplatforms_SYNC_URL = "content/productplatforms.json",
    productplatforms_CONTAINER = "#productplatforms-items-container",
    productplatforms_ITEM_TEMPLATE = "#productplatforms-item-template";

var ProductPlatformsUtils = {
    sharePointSync: function (callback) {

        //TODO: replace with sharepoint connection
        $.getJSON(productplatforms_SYNC_URL, function (data) {

            $.each(data, function (index, value) {
                var productplatformsItem;

                productplatformsItem = new Productplatforms(value);
                persistence.add(productplatformsItem);
            });

            persistence.flush(
                function () {
                    //DB is updated - trigger custom event
                    if (typeof callback === "function") {
                        callback();
                    }

                    $('body').trigger('productplatforms-sync-ready');
                }
            );
        }).fail(
            function () {
                //TODO: error handling if necessary
                alert("productplatforms: Mock data read error.");

                if (typeof callback === "function") {
                    callback();
                }
            }
        );
    },

    displayproductplatforms: function () {
        var $container = $(productplatforms_CONTAINER),
            $template = $(productplatforms_ITEM_TEMPLATE);

        if ($container.length && $template.length) {
            Productplatforms.all().list(null, function (results) {
                $.each(results, function (index, value) {

                    var data = value._data;
                    var $newItem = $template.clone();

                    $newItem.removeAttr('id');
                    $('.productplatforms-item-title', $newItem).html(data.productplatform).attr("href", "MPLProdukt.html?Produktplattform=" + data.productplatformid);


                    $container.append($newItem.removeClass('hidden'));

                });
            });
        }
    }
};

//bind to sync ready event in order to display the productplatforms
$('body').on('productplatforms-sync-ready', ProductPlatformsUtils.displayproductplatforms);