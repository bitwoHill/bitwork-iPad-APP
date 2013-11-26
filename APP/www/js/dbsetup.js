(function($){

    var modelDependencies = [
            "js/config.js",
            "js/model/sharepoint.js",
            "js/model/calendar.js",
            "js/model/contacts.js",
            "js/model/link.js",
            "js/model/equipmentproducts.js",
            "js/model/otherproducts.js",
            "js/model/news.js",
            "js/model/productfamilies.js",
            "js/model/productgroups.js",
            "js/model/productoptions.js",
            "js/model/productplatforms.js",
            "js/model/products.js",
            "js/model/documents.js",
            "js/model/infothek.js"
        ],
        dbReady = false,
        loadCounter = 0,
        jsLoadHelper = function(){
            loadCounter++;
         
            if(loadCounter === modelDependencies.length){
                dbReady = true;
            
                $('body').trigger('js-model-ready');
            }
         
                 
        };

    for(var i=0; i<modelDependencies.length; i++) {
        $.getScript(modelDependencies[i],jsLoadHelper);
    }

    var dbSetup = function(){
        //setup DB connection
        persistence.store.websql.config(persistence, "bitwork_ipadapp", 'bitwork iPadApp database', 10 * 1024 * 1024);
        //create DB schema
        persistence.schemaSync(function(){
            //Sync with sharepoint
            NewsModel.syncNews();
            CalendarModel.syncCalendar();
            LinkModel.syncLinks();
            ProductGroupsModel.syncProductGroups();
            ProductFamiliesModel.sharePointFamilies();
            ProductPlatformsModel.sharePointPlatforms();
            ProductsModel.sharePointProducts();
            otherproductsModel.sharePointOtherproducts();
            equipmentproductsModel.sharePointEquipmentproducts();

            //Sync with mock
             ContactsModel.sharePointSync();
             productoptionsModel.sharePointSync();
            documentsModel.sharePointSync();
            InfothekModel.sharePointSync();
        });
    };

    //DB setup when model is ready to load
    $('body').on('js-model-ready', dbSetup);
})(jQuery)