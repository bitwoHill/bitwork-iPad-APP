var PRODUCTPLATFORMS_LIST = "Produktplattformen";
//DB model
var Productplatforms = persistence.define('Productplatforms', {
    productplatformid: "INT",
    productplatform: "TEXT",
    productfamilyFK: "INT"
});

Productplatforms.index('productplatformid', { unique: true });

var ProductPlatformsModel = {
    sharePointPlatforms: function () {
        $('body').trigger('sync-start');
        SharePoint.sharePointRequest(PRODUCTPLATFORMS_LIST, ProductPlatformsModel.mapSharePointData);
    },
    //maps SharePoint data to current model
    mapSharePointData: function (data) {
        var spData = data.d;
        Productplatforms.all().destroyAll(function (ele) {
            if (spData && spData.results.length) {
                $.each(spData.results, function (index, value) {
                    //mapping
                    var productplatformsItem =
                        {
                            productplatformid: value.ID,
                            productplatform: (value.Produktplattformen) ? value.Produktplattformen : "",
                            productfamilyFK: (value.ProduktfamilieId) ? value.ProduktfamilieId : ""
                        };

                    //add to persistence
                    persistence.add(new Productplatforms(productplatformsItem));
                });

                persistence.flush(
                    function () {
                        SyncModel.addSync(PRODUCTPLATFORMS_LIST);
                        $('body').trigger('sync-end');
                        $('body').trigger('productplatforms-sync-ready');
                    }
                );
            }
        });
    }
};