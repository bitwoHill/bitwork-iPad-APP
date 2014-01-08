var PRODUCTOPTIONS_LIST = "ProduktbezeichnungOptionen";
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
    equipmentFK: "INT"
});

ProductOptions.index(['productOptionId', 'piecenumber'], { unique: true });

//create mock data for equipment products
var productoptionsModel = {
    sharePointProductOptions: function () {

        $('body').trigger('sync-start');
        SharePoint.sharePointRequest(PRODUCTOPTIONS_LIST, productoptionsModel.mapSharePointData);
    },
    //maps SharePoint data to current model
    mapSharePointData: function (data) {
        var spData = data.d;
        ProductOptions.all().destroyAll(function (ele) {
            if (spData && spData.results.length) {
                $.each(spData.results, function (index, value) {
                    var productoptionsItem =
                        {
                            productOptionId: value.ID,
                            productDescription: (value.ProduktbezeichnungOptionen) ? value.ProduktbezeichnungOptionen : "",
                            pieceNumber: (value.Teilenummer) ? value.Teilenummer : "",
                            price: (value.Listenpreis) ? value.Listenpreis : "",
                            productgroupFK: (value.ProduktgruppeId) ? value.ProduktgruppeId : "",
                            productfamilyFK: (value.ProduktfamilieId) ? value.ProduktfamilieId : "",
                            productplatformFK: (value.ProduktplattformId) ? value.ProduktplattformId : "",
                            productFK: (value.ProduktId) ? value.ProduktId : "",
                            equipmentFK: (value.ProduktbezeichnungEquipmentId) ? value.ProduktbezeichnungEquipmentId : ""
                        };

                    persistence.add(new ProductOptions(productoptionsItem));

                });

                persistence.flush(
                    function () {
                        SyncModel.addSync(PRODUCTOPTIONS_LIST);
                        $('body').trigger('productoptions-sync-ready');
                    }
                );
            }
        });


    }
};