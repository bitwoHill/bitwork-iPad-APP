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
    equipmentFK: "TEXT",
    localModifiedDate: "DATE"

});

ProductOptions.index(['productOptionId', 'piecenumber'], { unique: true });

//create mock data for equipment products
var productoptionsModel = {
    sharePointProductOptions: function () {

        $('body').trigger('sync-start');
        $('#msgProductOptions').toggleClass('in');

        SharePoint.sharePointRequest(PRODUCTOPTIONS_LIST, productoptionsModel.mapSharePointData, true);
    },
    //maps SharePoint data to current model
    mapSharePointData: function (data) {
        var spData = data.d;
        //create lookup Array with all SP Items stored by ID. This is used to compare the Local Document IDs to those on Sharepoint
        var lookupIDsSharePoint = {};
        //One specific SharePoint Item used for Adding to local DB
        //Suchindex leeren
        utils.emptySearchIndex("ProductOptions");

        if (spData && spData.results.length) {
            $.each(spData.results, function (index, value) {

                lookupIDsSharePoint[value.ID] = value;
                try {
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
                            productFK: (productFKs) ? productFKs : "",
                            equipmentFK: (equipmentFKs) ? equipmentFKs : ""
                        };
                    //Parse modified date
                    if (value.Geändert) {
                        productoptionsItem.localModifiedDate = utils.parseSharePointDate(value.Geändert);
                    }
                    persistence.add(new ProductOptions(productoptionsItem));
                }
                catch (e) {
                    console.log(e);
                    console.log(e.message);
                }
            });

            //persist new items to DB
            persistence.flush(function () {
                console.log("done adding new");


               // console.log(lookupIDsSharePoint);
                //iterate all local files. If Document in LookupID List update, else delete by SP Item
                ProductOptions.all().each(null, function (dbItem) {
                    //console.log(dbItem);
                    //check if ID still exists on SharePoint
                    if (lookupIDsSharePoint[dbItem.productOptionId()]) {

                        //update routine / Adding routine
                        //One specific SharePoint Item used for Updateing local DB
                        var spItem = lookupIDsSharePoint[dbItem.productOptionId()];
                       // console.log("SPITEM Productoptions");
                       // console.log(spItem);


                        //get SP Item stored in Array by ID of current local Item
                        if (spItem) {
                            if (dbItem.localModifiedDate()) {
                                if (dbItem.localModifiedDate().getTime() == utils.parseSharePointDate(spItem.Geändert).getTime()) {
                                    //  console.log("skipped" + dbItem.productOptionId());
                                    return true;
                                }
                            }
                            //console.log("start updating" + dbItem.productOptionId());
                            // console.log(dbItem);


                            var productgroupFKs = "";
                            if (spItem.Produktgruppe) {
                                for (var i2 = 0, len2 = spItem.Produktgruppe.results.length; i2 < len2; i2++) {
                                    productgroupFKs += "_" + spItem.Produktgruppe.results[i2].ID + ";";
                                }
                            }
                            var productfamilieFKs = "";
                            if (spItem.Produktfamilie) {
                                for (var i2 = 0, len3 = spItem.Produktfamilie.results.length; i2 < len3; i2++) {
                                    productfamilieFKs += "_" + spItem.Produktfamilie.results[i2].ID + ";";
                                }
                            }
                            var productplattformFKs = "";
                            if (spItem.Produktfamilie) {
                                for (var i2 = 0, len4 = spItem.Produktplattform.results.length; i2 < len4; i2++) {
                                    productplattformFKs += "_" + spItem.Produktplattform.results[i2].ID + ";";
                                }
                            }
                            var productFKs = "";
                            if (spItem.Produkt) {
                                for (var i2 = 0, len5 = spItem.Produkt.results.length; i2 < len5; i2++) {
                                    productFKs += "_" + spItem.Produkt.results[i2].ID + ";";
                                }
                            }
                            var equipmentFKs = "";
                            if (spItem.ProduktbezeichnungEquipment) {
                                for (var i2 = 0, len6 = spItem.ProduktbezeichnungEquipment.results.length; i2 < len6; i2++) {
                                    equipmentFKs += "_" + spItem.ProduktbezeichnungEquipment.results[i2].ID + ";";
                                }
                            }



                            dbItem.productDescription((spItem.ProduktbezeichnungOptionen) ? spItem.ProduktbezeichnungOptionen : "");
                            dbItem.pieceNumber((spItem.Teilenummer) ? spItem.Teilenummer : "");
                            dbItem.price((spItem.Listenpreis) ? spItem.Listenpreis : "");
                            dbItem.productgroupFK((productgroupFKs) ? productgroupFKs : "");
                            dbItem.productfamilyFK((productfamilieFKs) ? productfamilieFKs : "");
                            dbItem.productplatformFK((productplattformFKs) ? productplattformFKs : "");
                            dbItem.productFK((productFKs) ? productFKs : "");
                            dbItem.equipmentFK((equipmentFKs) ? equipmentFKs : "");

                            //Parse modified date
                            if (spItem.Geändert) {
                                dbItem.localModifiedDate = utils.parseSharePointDate(spItem.Geändert);
                            }





                        }
                        delete spItem;
                    }
                    else//delete
                    {
                        console.debug("lokales element wurde nicht mehr gefunden: ");
                        console.debug(dbItem.productOptionId());

                        // remove entity from persistence layer
                        persistence.remove(dbItem);
                    }
                });

                persistence.flush(
                    function () {
                        delete lookupIDsSharePoint;

                        console.log("done flushing");
                        SyncModel.addSync(PRODUCTOPTIONS_LIST);
                        $('body').trigger('productoptions-sync-ready');
                        $('#msgProductOptions').removeClass('in');
   $('body').trigger('sync-end');
                    }
                );

            });





        }



    }
};