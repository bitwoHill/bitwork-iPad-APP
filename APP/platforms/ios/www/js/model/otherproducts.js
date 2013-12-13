var OTHERPRODUCTS_LIST = "ProduktbezeichnungSonstige";


//OTher Products
var OtherProducts = persistence.define('OtherProducts', {
    otherProductId: "INT",
    productDescription: "TEXT",
    pieceNumber: "TEXT",
    price: "TEXT",
    productFK: "INT"
});

//OtherProducts.index(['otherProductId', 'pieceNumber'], { unique: true });
OtherProducts.index('otherProductId', { unique: true });


//create mock data for equipment products
var otherproductsModel = {
    sharePointOtherproducts: function () {

        $('body').trigger('sync-start');
        SharePoint.sharePointRequest(OTHERPRODUCTS_LIST, otherproductsModel.mapSharePointData);
    },
    //maps SharePoint data to current model
    mapSharePointData: function (data) {
        var spData = data.d;
        OtherProducts.all().destroyAll(function (ele) {
            utils.emptySearchIndex("OtherProducts");

            if (spData && spData.results.length) {
                $.each(spData.results, function (index, value) {


                    var otherproductsItem = {
                        otherProductId: value.ID,
                        productDescription: (value.ProduktbezeichnungSonstige) ? value.ProduktbezeichnungSonstige : "",
                        pieceNumber: (value.Teilenummer) ? value.Teilenummer : "",
                        price: (value.Listenpreis) ? value.Listenpreis : "",
                        productFK: (value.ProduktId) ? value.ProduktId : -1
                    };

                    persistence.add(new OtherProducts(otherproductsItem));
                });

                persistence.flush(
                    function () {
                        SyncModel.addSync(OTHERPRODUCTS_LIST);
                        $('body').trigger('sync-end');
                        $('body').trigger('otherproducts-sync-ready');
                    }
                );
            }
        });
    },

    searchOtherproduct: function (key) {
        var otherproductSearch = $.Deferred();
        key = "%" + key.replace("*", "") + "%";

        OtherProducts.all().filter("productDescription", "LIKE", key).or(new persistence.PropertyFilter("pieceNumber", "LIKE", key)).list(function (res) {
            otherproductSearch.resolve(res);
        });

        return otherproductSearch.promise();
    }

};