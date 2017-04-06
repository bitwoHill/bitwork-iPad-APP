var appUser;

(function ($) {
    persistence.store.websql.config(persistence, "bitwork_ipadapp", 'bitwork iPadApp database', 50 * 1024 * 1024);
    persistence.search.config(persistence, persistence.store.websql.sqliteDialect);
    //create DB schema
    persistence.debug = false;

    var modelDependencies = ["js/config.js", "js/model/login.js", "js/model/downloads.js", "js/model/sharepoint.js", "js/model/calendar.js", "js/model/contacts.js", "js/model/link.js", "js/model/equipmentproducts.js", "js/model/otherproducts.js", "js/model/news.js", "js/model/productfamilies.js", "js/model/productgroups.js", "js/model/productoptions.js", "js/model/productplatforms.js", "js/model/products.js", "js/model/documents.js", "js/model/infothek.js"], dbReady = false, loadCounter = 0, jsLoadHelper = function () {
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


            //Alter Tables if necessary
            persistence.defineMigration(1, {
                up: function () {
                    this.dropTable('Contacts');
                },
                down: function () {
                    this.executeSql('CREATE TABLE IF NOT EXISTS Contacts (contactId TEXT PRIMARY KEY, name TEXT, forename TEXT, phone TEXT, mobilePhone TEXT, fax TEXT, email TEXT, department TEXT, jobFunction TEXT, profilePicture TEXT, description TEXT, representative TEXT, isFolder BOOL, parentFolder TEXT)');

                }
            })

            persistence.defineMigration(2, {
                up: function () {
                    this.dropTable('Contacts');
                },
                down: function () {
                    this.executeSql('CREATE TABLE IF NOT EXISTS Contacts (contactId TEXT PRIMARY KEY, name TEXT, forename TEXT, phone TEXT, mobilePhone TEXT, fax TEXT, email TEXT, department TEXT, jobFunction TEXT, profilePicture TEXT, description TEXT, jobdescription TEXT, representative TEXT, isFolder BOOL, parentFolder TEXT)');

                }
            })


            persistence.defineMigration(3, {
                up: function () {
                    this.dropTable('News');
                    this.dropTable('Contacts');
                    this.dropTable('ProductOptions');

                },
                down: function () {


                }
            })

             persistence.defineMigration(5, {
                up: function () {
                    this.dropTable('Documents');
                   

                },
                down: function () {


                }
            })


                ;

            ////Alter Tables if necessary
            //persistence.defineMigration(2, {
            //    up: function() {
            //           this.dropTable('Contacts');
            //            },
            //    down: function() {
            //        this.executeSql('CREATE TABLE IF NOT EXISTS Contacts (contactId TEXT PRIMARY KEY, name TEXT, forename TEXT, phone TEXT, mobilePhone TEXT, fax TEXT, email TEXT, department TEXT, jobFunction TEXT, profilePicture TEXT, description TEXT, representative TEXT, isFolder BOOL, parentFolder TEXT)');
            //
            //    }
            //});



            //gutes beispiel für Callback methode 
            function migrate(callback) {
                console.log('migrating...');
                persistence.migrations.init(function () {
                    console.log('migration init');
                    persistence.migrate(function () {
                        console.debug('migration complete!');
                        callback();
                    });
                });
            };

            migrate(onMigrationComplete);

            function onMigrationComplete() {
                // database is ready. do amazing things...
                persistence.schemaSync(function () {
                    appUser.initUser(function () {
                        console.log("DBReady");
                        $('body').trigger('db-schema-ready');
                    });
                });


            };

            //ende beispiel
        });


        //start app

    };

    var sharePointSync = function () {
        var syncQueue = $({});
        var syncQueue2 = $({});
        var syncQueue3 = $({});
        //var syncQueue4 = $({});
        //product options
        syncQueue2.queue("sync-queue2", function (next) {
            //bind event
            console.log("sync product options");
            $('body').on('productoptions-sync-ready sync-error', function () {
                //unbind event
                $('body').off('productoptions-sync-ready sync-error', next);
                next();
            });
            productoptionsModel.sharePointProductOptions();
        });
        //documents
        syncQueue3.queue("sync-queue3", function (next) {
            //bind event
            console.log("sync Product Documents");
            $('body').on('documents-sync-ready sync-error', function () {
                //unbind event
                $('body').off('documents-sync-ready sync-error', next);
                next();
            });
            documentsModel.syncSharePointDocumentsWithoutDelete();
        });
        //infothek
        syncQueue3.queue("sync-queue3", function (next) {
            //bind event
            console.log("sync Infothek");
            $('body').on('infothek-sync-ready sync-error', function () {
                //unbind event
                $('body').off('infothek-sync-ready sync-error', next);
                next();
            });
            InfothekModel.syncInfothek();
        });


        //Add news sync to queue
        syncQueue.queue("sync-queue", function (next) {
            //bind event
            console.log("sync News");
            $('body').on('news-sync-ready sync-error', function () {
                //unbind event
                $('body').off('news-sync-ready sync-error', next);
                next();
            });
            NewsModel.syncNews();
        });

        //Add calendar sync to queue
        syncQueue.queue("sync-queue", function (next) {
            //bind event
            console.log("sync Calendar");
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
            console.log("sync Links");
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
            console.log("sync Contacts");
            $('body').on('contacts-sync-ready sync-error', function () {
                //unbind event
                $('body').off('contacts-sync-ready sync-error', next);
                next();
            });
            ContactsModel.syncContacts();
        });
        //Productgroups
        syncQueue.queue("sync-queue", function (next) {
            //bind event
            console.log("Product Groups News");
            $('body').on('productgroups-sync-ready sync-error', function () {
                //unbind event
                $('body').off('productgroups-sync-ready sync-error', next);
                next();
            });
            ProductGroupsModel.syncProductGroups();
        });
        //Product Families
        syncQueue.queue("sync-queue", function (next) {
            //bind event
            console.log("sync Families");
            $('body').on('productfamilies-sync-ready sync-error', function () {
                //unbind event
                $('body').off('productfamilies-sync-ready sync-error', next);
                next();
            });
            ProductFamiliesModel.sharePointFamilies();
        });
        //plattforms
        syncQueue.queue("sync-queue", function (next) {
            //bind event
            console.log("sync product platforms");
            $('body').on('productplatforms-sync-ready sync-error', function () {
                //unbind event
                $('body').off('productplatforms-sync-ready sync-error', next);
                next();
            });
            ProductPlatformsModel.sharePointPlatforms();
        });
        //product
        syncQueue.queue("sync-queue", function (next) {
            //bind event
            console.log("sync products");
            $('body').on('products-sync-ready sync-error', function () {
                //unbind event
                $('body').off('products-sync-ready sync-error', next);
                next();
            });
            ProductsModel.sharePointProducts();
        });
        //other products
        syncQueue.queue("sync-queue", function (next) {
            //bind event
            console.log("other products News");
            $('body').on('otherproducts-sync-ready sync-error', function () {
                //unbind event
                $('body').off('otherproducts-sync-ready sync-error', next);
                next();
            });
            otherproductsModel.sharePointOtherproducts();
        });
        //equipement
        syncQueue.queue("sync-queue", function (next) {
            //bind event
            console.log("sync equipment");
            $('body').on('equipmentproducts-sync-ready sync-error', function () {
                //unbind event
                $('body').off('equipmentproducts-sync-ready sync-error', next);
                next();
            });
            equipmentproductsModel.sharePointEquipmentproducts();
        });


        syncQueue.dequeue("sync-queue");
        syncQueue2.dequeue("sync-queue2");
        syncQueue3.dequeue("sync-queue3");
       // syncQueue4.dequeue("sync-queue4");
    };


    //DB setup when model is ready to load
    $('body').on('js-model-ready', dbSetup);

    ////Sync on demand
    //$('body').on('click', 'a.side-menu-sync-link', function () {
    //    $('body').removeClass('side-menu-active');
    //    sharePointSync();
    //});

    //Sync on demand
    $('body').on('click', '.sync-btn-metadata', function () {
     
        var networkState = navigator.connection.type;
        if (networkState != Connection.NONE) {
               $('body').removeClass('side-menu-active');
            sharePointSync();
        } else {
            alert("Es besteht keine Internetverbindung. Der Vorgang wird abgebrochen.");
        }
    });



    $('body').on('sync-error', function (e) {
        alert("Es gab einen Fehler beim synchronisieren. Versuchen Sie es später erneut.");
       syncQueue.dequeue("sync-queue");
        syncQueue2.dequeue("sync-queue2");
        syncQueue3.dequeue("sync-queue3");
       // syncQueue4.dequeue("sync-queue4");
    });

})(jQuery); 