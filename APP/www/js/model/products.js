//this class does not display any contents of the product database. it only fetches data and filters the productequipment and otherproducts pages
var PRODUCTS_LIST = "Produkt";

//DB model
var Products = persistence.define('Products', {
    productid: "INT",
    product: "TEXT",
    productplatformFK: "INT"
});

Products.index('productid', { unique: true });


var ProductsModel = {
    sharePointProducts: function () {

        $('body').trigger('sync-start');
        SharePoint.sharePointRequest(PRODUCTS_LIST, ProductsModel.mapSharePointData);
    },
    //maps SharePoint data to current model
    mapSharePointData: function (data) {
        var spData = data.d;
        Products.all().destroyAll(function (ele) { 
        if (spData && spData.results.length) {
            $.each(spData.results, function (index, value) {
                //mapping
           
                var productsItem = {
                    productid: value.ID,
                    product: (value.Produkt) ? value.Produkt : "",
                    productplatformFK: (value.PlattformId) ? value.PlattformId : ""
                };


                //add to persistence
                persistence.add(new Products(productsItem));
            });

            persistence.flush(
               function () {
                   SyncModel.addSync(PRODUCTS_LIST);
                 
                  $('body').trigger('products-sync-ready');
               }
           );
        }});
    }
};