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
            $('body').trigger('db-schema-ready');
            //Sync with sharepoint
            //NewsModel.syncNews();
            //CalendarModel.syncCalendar();
            //LinkModel.syncLinks();
            //ContactsModel.syncContacts();
            //ProductGroupsModel.syncProductGroups();
            //ProductFamiliesModel.sharePointFamilies();
            //ProductPlatformsModel.sharePointPlatforms();
            ///ProductsModel.sharePointProducts();
            //otherproductsModel.sharePointOtherproducts();
            //equipmentproductsModel.sharePointEquipmentproducts();

            //Sync with mock
            //productoptionsModel.sharePointSync();
            //documentsModel.sharePointSync();
            //InfothekModel.sharePointSync();
        });
    };


    var sharePointSync = function(){
        var syncQueue = $({});

        //Add news sync to queue
        syncQueue.queue("sync-queue", function(next){
            //bind event
            $('body').on('news-sync-ready', function(){
                next();
                //unbind event
                $('body').off('news-sync-ready', next);
            });
            NewsModel.syncNews();
        });

        //Add calendar sync to queue
        syncQueue.queue("sync-queue", function(next){
            //bind event
            $('body').on('calendar-sync-ready', function(){
                //unbind event
                $('body').off('calendar-sync-ready', next);
                next();
            });
            CalendarModel.syncCalendar();
        });

        //Add Link sync to queue
        syncQueue.queue("sync-queue", function(next){
            //bind event
            $('body').on('link-sync-ready', function(){
                //unbind event
                $('body').off('link-sync-ready', next);
                next();
            });
            LinkModel.syncLinks();
        });

        //Add contacts sync to queue
        syncQueue.queue("sync-queue", function(next){
            //bind event
            $('body').on('contacts-sync-ready', function(){
                //unbind event
                $('body').off('contacts-sync-ready', next);
                next();
            });
            ContactsModel.syncContacts();
        });

        syncQueue.dequeue("sync-queue");
    }


    //DB setup when model is ready to load
    $('body').on('js-model-ready', dbSetup);

    //Sync on demand
    $('body').on('click', 'a.side-menu-sync-link', function(){
        $('body').removeClass('side-menu-active');
        sharePointSync();
    });
})(jQuery)