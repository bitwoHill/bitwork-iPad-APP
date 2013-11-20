var productfamilies_SYNC_URL = "content/productfamilies.json";

//DB Model
var Productfamilies = persistence.define('Productfamilies', {
    productfamilyid: "INT",
    productfamily: "TEXT",
    productgroupFK: "INT"
});

Productfamilies.index('productfamilyid', { unique: true });


var ProductFamiliesModel = {
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
    }
};