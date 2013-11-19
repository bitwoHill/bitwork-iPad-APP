var productplatforms_SYNC_URL = "content/productplatforms.json";

//DB model
var Productplatforms = persistence.define('Productplatforms', {
    productplatformid: "INT",
    productplatform: "TEXT",
    productfamilyFK: "INT"
});

Productplatforms.index('productplatformid', { unique: true });

var ProductPlatformsModel = {
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
    }
};