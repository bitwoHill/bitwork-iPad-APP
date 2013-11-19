var productoptions_SYNC_URL = "content/productoptions.json";

//DB model
var ProductOptions = persistence.define('ProductOptions', {
    productOptionId: "INT",
    productDescription: "TEXT",
    pieceNumber: "TEXT",
    price: "TEXT",
    productgroupFK: "INT",
    productfamilyFK: "INT",
    productplatformFK: "INT",
    productFK: "INT",
    EquipmentFK: "INT"
});

ProductOptions.index(['productOptionId', 'piecenumber'], { unique: true });

//create mock data for equipment products
var productoptionsModel = {
    sharePointSync: function (callback) {

        //TODO: replace with sharepoint connection
        $.getJSON(productoptions_SYNC_URL,function (data) {

            $.each(data, function (index, value) {
                var productoptionsItem;

                productoptionsItem = new ProductOptions(value);
                persistence.add(productoptionsItem);
            });

            persistence.flush(
                function () {
                    //DB is updated - trigger custom event
                    if (typeof callback === "function") {
                        callback();
                    }

                    $('body').trigger('productoptions-sync-ready');
                }
            );
        }).fail(
            function () {
                //TODO: error handling if necessary
                alert("MPL Stammdaten: Mock data read error.");

                if (typeof callback === "function") {
                    callback();
                }
            }
        );


    }
};