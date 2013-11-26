var PRODUCTGROUPS_LIST = "Produktgruppen";

//DB model
var Productgroups = persistence.define('Productgroups', {
    productgroupid: "INT",
    productgroup: "TEXT"
});

Productgroups.index('productgroupid', { unique: true });

var ProductGroupsModel = {
    syncProductGroups: function () {
        $('body').trigger('sync-start');
        SharePoint.sharePointRequest(PRODUCTGROUPS_LIST, ProductGroupsModel.mapSharePointData);
    },
    //maps SharePoint data to current model
    mapSharePointData: function (data) {
        var spData = data.d;
        if (spData && spData.results.length) {
            $.each(spData.results, function (index, value) {
                var ProductGroupItem =
                    {
                        productgroupid: value.ID,
                        productgroup: (value.Produktgruppe) ? value.Produktgruppe : ""
                    };
                
                persistence.add(new Productgroups(ProductGroupItem));
            });

               persistence.flush(
                function () {
                    SyncModel.addSync(PRODUCTGROUPS_LIST);
                    $('body').trigger('sync-end');
                    $('body').trigger('productgroups-sync-ready');
                }
            );
        }
    }
};