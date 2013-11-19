var equipmentproducts_SYNC_URL = "content/equipmentproducts.json",
    otherproducts_SYNC_URL = "content/otherproducts.json";

//DB model
var EquipmentProducts = persistence.define('EquipmentProducts', {
    EquipmentId: "INT",
    productDescription: "TEXT",
    pieceNumber: "TEXT",
    price: "TEXT",
    cooling: "TEXT",
    variant: "TEXT",
    volume: "TEXT",
    pressure: "TEXT",
    performance: "TEXT",
    productFK: "INT"
});

EquipmentProducts.index(['EquipmentId', 'piecenumber'], { unique: true });

//create mock data for equipment products
var equipmentproductsModel = {
    sharePointSync: function (callback) {

        //TODO: replace with sharepoint connection
        $.getJSON(equipmentproducts_SYNC_URL, function (data) {

            $.each(data, function (index, value) {
                var equipmentproductsItem;

                equipmentproductsItem = new EquipmentProducts(value);
                persistence.add(equipmentproductsItem);
            });

            persistence.flush(
                function () {
                    //DB is updated - trigger custom event
                    if (typeof callback === "function") {
                        callback();
                    }

                    $('body').trigger('equipmentproducts-sync-ready');
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