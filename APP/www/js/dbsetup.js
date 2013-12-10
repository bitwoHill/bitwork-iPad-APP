var appUser;

(function ($) {
    persistence.store.websql.config(persistence, "bitwork_ipadapp", 'bitwork iPadApp database', 10 * 1024 * 1024);
    persistence.search.config(persistence, persistence.store.websql.sqliteDialect);
    //create DB schema
    persistence.debug = false;


    var modelDependencies = [
            "js/config.js",
            "js/model/login.js",
            "js/model/downloads.js",
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
        jsLoadHelper = function () {
            loadCounter++;

            if (loadCounter === modelDependencies.length) {
                dbReady = true;

                $('body').trigger('js-model-ready');
            }


        };

    for (var i = 0; i < modelDependencies.length; i++) {
        $.getScript(modelDependencies[i], jsLoadHelper);
    }


    var dbSetup = function () {
        //init User
        appUser = new User();
        //setup DB connection
        persistence.schemaSync(function () {
            appUser.initUser(function () {
                $('body').trigger('db-schema-ready');
            });
        });
    };


    var sharePointSync = function () {
        var syncQueue = $({});

        //Add news sync to queue
        syncQueue.queue("sync-queue", function (next) {
            //bind event
            $('body').on('news-sync-ready sync-error', function () {
                next();
                //unbind event
                $('body').off('news-sync-ready sync-error', next);
            });
            NewsModel.syncNews();
        });

        //Add calendar sync to queue
        syncQueue.queue("sync-queue", function (next) {
            //bind event
            $('body').on('calendar-sync-ready sync-error', function () {
                //unbind event
                $('body').off('calendar-sync-ready sync-error', next);
                next();
            });
            CalendarModel.syncCalendar();
        });

        //Add Link sync to queue
        syncQueue.queue("sync-queue", function (next) {
            //bind event
            $('body').on('link-sync-ready sync-error', function () {
                //unbind event
                $('body').off('link-sync-ready sync-error', next);
                next();
            });
            LinkModel.syncLinks();
        });

        //Add contacts sync to queue
        syncQueue.queue("sync-queue", function (next) {
            //bind event
            $('body').on('contacts-sync-ready sync-error', function () {
                //unbind event
                $('body').off('contacts-sync-ready sync-error', next);
                next();
            });
            ContactsModel.syncContacts();
        });

        syncQueue.queue("sync-queue", function (next) {
            //bind event
            $('body').on('productgroups-sync-ready sync-error', function () {
                //unbind event
                $('body').off('productgroups-sync-ready sync-error', next);
                next();
            });
            ProductGroupsModel.syncProductGroups();
        });

        syncQueue.queue("sync-queue", function (next) {
            //bind event
            $('body').on('productfamilies-sync-ready sync-error', function () {
                //unbind event
                $('body').off('productfamilies-sync-ready sync-error', next);
                next();
            });
            ProductFamiliesModel.sharePointFamilies();
        });

        syncQueue.queue("sync-queue", function (next) {
            //bind event
            $('body').on('productplatforms-sync-ready sync-error', function () {
                //unbind event
                $('body').off('productplatforms-sync-ready sync-error', next);
                next();
            });
            ProductPlatformsModel.sharePointPlatforms();
        });

        syncQueue.queue("sync-queue", function (next) {
            //bind event
            $('body').on('products-sync-ready sync-error', function () {
                //unbind event
                $('body').off('products-sync-ready sync-error', next);
                next();
            });
            ProductsModel.sharePointProducts();
        });

        syncQueue.queue("sync-queue", function (next) {
            //bind event
            $('body').on('otherproducts-sync-ready sync-error', function () {
                //unbind event
                $('body').off('otherproducts-sync-ready sync-error', next);
                next();
            });
            otherproductsModel.sharePointOtherproducts();
        });

        syncQueue.queue("sync-queue", function (next) {
            //bind event
            $('body').on('equipmentproducts-sync-ready sync-error', function () {
                //unbind event
                $('body').off('equipmentproducts-sync-ready sync-error', next);
                next();
            });
            equipmentproductsModel.sharePointEquipmentproducts();
        });

        syncQueue.queue("sync-queue", function (next) {
            //bind event
            $('body').on('productoptions-sync-ready sync-error', function () {
                //unbind event
                $('body').off('productoptions-sync-ready sync-error', next);
                next();
            });
            productoptionsModel.sharePointProductOptions();
        });


        syncQueue.queue("sync-queue", function (next) {
            //bind event
            $('body').on('documents-sync-ready sync-error', function () {
                //unbind event
                $('body').off('documents-sync-ready sync-error', next);
                next();
            });
            documentsModel.sharePointDocuments();
        });

        syncQueue.queue("sync-queue", function (next) {
            //bind event
            $('body').on('infothek-sync-ready sync-error', function () {
                //unbind event
                $('body').off('infothek-sync-ready sync-error', next);
                next();
            });
            InfothekModel.syncInfothek();
        });


        syncQueue.dequeue("sync-queue");
    }


    //DB setup when model is ready to load
    $('body').on('js-model-ready', dbSetup);

    //Sync on demand
    $('body').on('click', 'a.side-menu-sync-link', function () {
        $('body').removeClass('side-menu-active');
        sharePointSync();
    });
})(jQuery)