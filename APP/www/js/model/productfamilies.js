var PRODUCTFAMILIES_LIST = "Produktfamilien";
//DB Model
var Productfamilies = persistence.define('Productfamilies', {
    productfamilyid: "INT",
    productfamily: "TEXT",
    productgroupFK: "INT"
});

Productfamilies.index('productfamilyid', { unique: true });


var ProductFamiliesModel = {
    sharePointFamilies: function () {
        $('body').trigger('sync-start');
        SharePoint.sharePointRequest(PRODUCTFAMILIES_LIST, ProductFamiliesModel.mapSharePointData);
    },
    //maps SharePoint data to current model
    mapSharePointData: function (data) {
        var spData = data.d;
        if (spData && spData.results.length) {
            $.each(spData.results, function (index, value) {
                                //mapping
                var productfamiliesItem = {
                    productfamilyid: value.ID,
                    productfamily: (value.Produktfamilien) ? value.Produktfamilien : "",
                    productgroupFK: (value.ProduktgruppeId) ? value.ProduktgruppeId : "",
                };

                //add to persistence
                persistence.add(new Productfamilies(productfamiliesItem));
            });

            persistence.flush(
                function () {
                    SyncModel.addSync(PRODUCTFAMILIES_LIST);
                    $('body').trigger('sync-end');
                    $('body').trigger('productfamilies-sync-ready');
                }
            );
        }
    }
};