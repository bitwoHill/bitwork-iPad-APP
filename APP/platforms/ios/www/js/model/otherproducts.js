var     otherproducts_SYNC_URL = "content/otherproducts.json";


//OTher Products
var OtherProducts = persistence.define('OtherProducts', {
    otherProductId: "INT",
    productDescription: "TEXT",
    pieceNumber: "TEXT",
    price: "TEXT",
    productFK: "INT"
});

OtherProducts.index(['otherProductId', 'piecenumber'], { unique: true });

//create mock data for equipment products
var otherproductsModel = {
    sharePointSync: function (callback) {

        //TODO: replace with sharepoint connection
       
        //get other OptionProducts
        //TODO: replace with sharepoint connection
        $.getJSON(otherproducts_SYNC_URL, function (data) {

            $.each(data, function (index, value) {
                var otherproductsItem;

                otherproductsItem = new OtherProducts(value);
                persistence.add(otherproductsItem);
            });

            persistence.flush(
                function () {
                    //DB is updated - trigger custom event
                    if (typeof callback === "function") {
                        callback();
                    }

                    $('body').trigger('otherproducts-sync-ready');
                }
            );
        }).fail(
            function () {
                //TODO: error handling if necessary
                alert("MPL Stammdaten otherproducts: Mock data read error.");

                if (typeof callback === "function") {
                    callback();
                }
            }
        );
    }
};