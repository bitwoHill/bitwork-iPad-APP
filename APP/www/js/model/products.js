//this class does not display any contents of the product database. it only fetches data and filters the productequipment and otherproducts pages
var products_SYNC_URL = "content/products.json";

//DB model
var Products = persistence.define('Products', {
    productid: "INT",
    product: "TEXT",
    productplatformFK: "INT"
});

Products.index('productid', { unique: true });


var ProductsModel = {
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
    }
};