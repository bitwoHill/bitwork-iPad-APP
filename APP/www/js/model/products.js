var products_SYNC_URL = "content/products.json",
    products_CONTAINER = "#products-items-container",
    products_ITEM_TEMPLATE = "#products-item-template";

var ProductsUtils= {
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
            Products.all().list(null, function (results) {
                $.each(results, function (index, value) {

                    var data = value._data;
                    var $newItem = $template.clone();

                    $newItem.removeAttr('id');
                    $('.products-item-title', $newItem).html(data.product).attr("href", "MPLStammdaten.html?Produkt=" + data.productid);


                    $container.append($newItem.removeClass('hidden'));

                });
            });
        }
    }
};

//bind to sync ready event in order to display the products
$('body').on('products-sync-ready', ProductsUtils.displayproducts);