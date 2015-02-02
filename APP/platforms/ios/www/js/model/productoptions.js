var PRODUCTOPTIONS_LIST = "ProduktbezeichnungOptionen";
//DB model
var ProductOptions = persistence.define('ProductOptions', {
    productOptionId: "INT",
    productDescription: "TEXT",
    pieceNumber: "TEXT",
    price: "TEXT",
    productgroupFK: "TEXT",
    productfamilyFK: "TEXT",
    productplatformFK: "TEXT",
    productFK: "TEXT",
    equipmentFK: "TEXT"
});

ProductOptions.index(['productOptionId', 'piecenumber'], { unique: true });

//create mock data for equipment products
var productoptionsModel = {
    sharePointProductOptions: function () {

        $('body').trigger('sync-start');
        $('#msgProductOptions').toggleClass('in');

        SharePoint.sharePointRequest(PRODUCTOPTIONS_LIST, productoptionsModel.mapSharePointData);
    },
    //maps SharePoint data to current model
    mapSharePointData: function (data) {
        var spData = data.d;
        ProductOptions.all().destroyAll(function (ele) {
            if (spData && spData.results.length) {
                $.each(spData.results, function (index, value) {


                                //Get Multilookup IDS for Productgroups,platforms,families and product and equipment
                                var productgroupFKs = "";
                                if (value.Produktgruppe) {
                                    for (var i2 = 0, len2 = value.Produktgruppe.results.length; i2 < len2; i2++) {
                                        productgroupFKs += "_" + value.Produktgruppe.results[i2].ID + ";";
                                    }
                                }
                                var productfamilieFKs = "";
                                if (value.Produktfamilie) {
                                    for (var i2 = 0, len3 = value.Produktfamilie.results.length; i2 < len3; i2++) {
                                        productfamilieFKs += "_" + value.Produktfamilie.results[i2].ID + ";";
                                    }
                                }
                                var productplattformFKs = "";
                                if (value.Produktfamilie) {
                                    for (var i2 = 0, len4 = value.Produktplattform.results.length; i2 < len4; i2++) {
                                        productplattformFKs += "_" + value.Produktplattform.results[i2].ID + ";";
                                    }
                                }
                                var productFKs = "";
                                if (value.Produkt) {
                                    for (var i2 = 0, len5 = value.Produkt.results.length; i2 < len5; i2++) {
                                        productFKs += "_" + value.Produkt.results[i2].ID + ";";
                                    }
                                }
                                var equipmentFKs = "";
                                if (value.ProduktbezeichnungEquipment) {
                                    for (var i2 = 0, len6 = value.ProduktbezeichnungEquipment.results.length; i2 < len6; i2++) {
                                        equipmentFKs += "_" + value.ProduktbezeichnungEquipment.results[i2].ID + ";";
                                    }
                                }


                    var productoptionsItem =
                        {
                            productOptionId: value.ID,
                            productDescription: (value.ProduktbezeichnungOptionen) ? value.ProduktbezeichnungOptionen : "",
                            pieceNumber: (value.Teilenummer) ? value.Teilenummer : "",
                            price: (value.Listenpreis) ? value.Listenpreis : "",
                            productgroupFK: (productgroupFKs) ? productgroupFKs : "",
                            productfamilyFK: (productfamilieFKs) ? productfamilieFKs : "",
                            productplatformFK: (productplattformFKs) ? productplattformFKs : "",
                            productFK: (productFKs) ?  productFKs: "",
                            equipmentFK: (equipmentFKs) ? equipmentFKs : ""
                        };

                    persistence.add(new ProductOptions(productoptionsItem));

                });

                persistence.flush(
                    function () {
                        SyncModel.addSync(PRODUCTOPTIONS_LIST);
                        $('body').trigger('productoptions-sync-ready');
                        $('#msgProductOptions').removeClass('in');

                    }
                );
            }
        });


    }
};