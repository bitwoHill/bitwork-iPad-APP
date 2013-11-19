var productgroups_SYNC_URL = "content/productgroups.json";

//DB model
var Productgroups = persistence.define('Productgroups', {
    productgroupid: "INT",
    productgroup: "TEXT"
});

Productgroups.index('productgroupid', { unique: true });

var ProductGroupsModel = {
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
    }
};