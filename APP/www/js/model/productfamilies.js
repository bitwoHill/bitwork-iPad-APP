var productfamilies_SYNC_URL = "content/productfamilies.json",
    productfamilies_CONTAINER = "#productfamilies-items-container",
    productfamilies_ITEM_TEMPLATE = "#productfamilies-item-template";

var ProductFamiliesUtils = {
    sharePointSync: function (callback) {

        //TODO: replace with sharepoint connection
        $.getJSON(productfamilies_SYNC_URL, function (data) {

            $.each(data, function (index, value) {
                var productfamiliesItem;

                productfamiliesItem = new Productfamilies(value);
                persistence.add(productfamiliesItem);
            });

            persistence.flush(
                function () {
                    //DB is updated - trigger custom event
                    if (typeof callback === "function") {
                        callback();
                    }

                    $('body').trigger('productfamilies-sync-ready');
                }
            );
        }).fail(
            function () {
                //TODO: error handling if necessary
                alert("productfamilies: Mock data read error.");

                if (typeof callback === "function") {
                    callback();
                }
            }
        );
    },

    displayproductfamilies: function () {
        var $container = $(productfamilies_CONTAINER),
            $template = $(productfamilies_ITEM_TEMPLATE);

        if ($container.length && $template.length) {
            Productfamilies.all().list(null, function (results) {
                $.each(results, function (index, value) {

                    var data = value._data;
                    var $newItem = $template.clone();

                    $newItem.removeAttr('id');
                    $('.productfamilies-item-title', $newItem).html(data.productfamily).attr("href", "MPLProduktplattformen.html?Produktfamilie=" + data.productfamilyid);


                    $container.append($newItem.removeClass('hidden'));

                });
            });
        }
    }
};

//bind to sync ready event in order to display the productfamilies
$('body').on('productfamilies-sync-ready', ProductFamiliesUtils.displayproductfamilies);