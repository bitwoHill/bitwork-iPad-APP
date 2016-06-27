var NEWS_LIST = "News";

//DB model
var News = persistence.define('News', {
    nodeId: "INT",
    title: "TEXT",
    body: "TEXT",
    bodySearch: "TEXT",
    image: "TEXT",
    expirationDate: "DATE",
    createdDate: "DATE",
    localModifiedDate: "DATE"
});

News.index('nodeId', { unique: true });
//News.textIndex('title');
//News.textIndex('bodySearch');

var NewsModel = {
    syncNews: function () {
        $('body').trigger('sync-start');
        $('#msgNews').toggleClass('in');

        SharePoint.sharePointRequest(NEWS_LIST, NewsModel.mapSharePointData);
    },

    //maps SharePoint data to current model
    mapSharePointData: function (data) {
        var spData = data.d;
        //create lookup Array with all SP Items stored by ID. This is used to compare the Local Document IDs to those on Sharepoint
        var lookupIDsSharePoint = {};
        //One specific SharePoint Item used for Adding to local DB
        var spItemAdd;
        //Suchindex leeren
        utils.emptySearchIndex("News");

        //For each SharePoint Resultitem- get all IDs which still exists on SP in order to delete local Documents not in this list.
        for (var i = 0, len = spData.results.length; i < len; i++) {

            try {
                spItemAdd = spData.results[i];
                lookupIDsSharePoint[spData.results[i].ID] = spData.results[i];

                if (spItemAdd) {
                    var bodyContent = (spItemAdd.Textkörper) ? NewsModel.formatBodyText(spItemAdd.Textkörper) : false,
                        newsItem = {
                            nodeId: spItemAdd.ID,
                            title: spItemAdd.Titel,
                            body: (bodyContent) ? bodyContent["bodyFormatted"] : "",
                            bodySearch: (bodyContent) ? bodyContent["bodyFormattedSearch"] : ""
                        };

                    if (spItemAdd.LäuftAb) {
                        newsItem.expirationDate = utils.parseSharePointDate(spItemAdd.LäuftAb);
                    }

                    if (spItemAdd.Erstellt) {
                        newsItem.createdDate = utils.parseSharePointDate(spItemAdd.Geändert);
                    }

                    //Parse modified date
                    if (spItemAdd.Geändert) {
                        newsItem.localModifiedDate = utils.parseSharePointDate(spItemAdd.Geändert);
                    }

                    //add to persistence instance
                    persistence.add(new News(newsItem));
                }

            }
            catch (e) {
                console.log(e);
                console.log(e.message);
            }

        }

            //persist new items to DB
            persistence.flush(function () {
                console.log("done adding new");



 //iterate all local files. If Document in LookupID List update, else delete by SP Item
                News.all().each(null, function (dbItem) {
                            //check if ID still exists on SharePoint
                            if (lookupIDsSharePoint[dbItem.nodeId()]) {
                               
                                //update routine / Adding routine
                                //One specific SharePoint Item used for Updateing local DB
                                var spItem = lookupIDsSharePoint[dbItem.nodeId()];
                             
                          
                                
                                //get SP Item stored in Array by ID of current local Item
                                if (spItem) {
                                      if (dbItem.localModifiedDate()){
                                            if (dbItem.localModifiedDate().getTime() == utils.parseSharePointDate(spItem.Geändert).getTime()) {
                                          //  console.log("skipped" + dbItem.nodeId());
                                        return true;
                                            }
                                      }
                                     console.log("start updating" + dbItem.nodeId());
                                     // console.log(dbItem);
                                    var bodyContent = (spItem.Textkörper) ? NewsModel.formatBodyText(spItem.Textkörper) : false

                                    if (bodyContent) {
                                        dbItem.body (bodyContent ? bodyContent["bodyFormatted"] : "");
                                        dbItem.bodySearch (bodyContent ? bodyContent["bodyFormattedSearch"] : "");
                                    }

                                    if (spItem.Titel) {
                                        dbItem.title( spItem.Titel);
                                    }


                                    if (spItem.LäuftAb) {
                                       dbItem.expirationDate(utils.parseSharePointDate(spItem.LäuftAb));
                                    }

                                    if (spItem.Erstellt) {
                                       dbItem.createdDate(utils.parseSharePointDate(spItem.Geändert));
                                    }

                                    //Parse modified date
                                    if (spItem.Geändert) {
                                     dbItem.localModifiedDate(utils.parseSharePointDate(spItem.Geändert));
                                        
                                    }


                                 //console.log("updated item: " + dbItem.nodeId());
                                 //console.log( dbItem);
                                 
                               
                                }
                                delete spItem;
                            }
                            else//delete
                            {
                                console.debug("lokales element wurde nicht mehr gefunden: ");
                                console.debug(dbItem.nodeId());

                                // remove entity from persistence layer
                                persistence.remove(dbItem);
                            }
                       
                    
                });


            });
                  
 

                    persistence.flush(
                        function () {
                            console.log("done flushing");
                            SyncModel.addSync(NEWS_LIST);
                            $('body').trigger('sync-end');
                            $('body').trigger('news-sync-ready');
                            $('#msgNews').removeClass('in');

                        }
                    );

                    delete lookupIDsSharePoint;
                    delete spItemAdd;

                

            //wipe database of old entries
            //        News.all().destroyAll(function (ele) {
            //            utils.emptySearchIndex("News");
            //            if (spData && spData.results.length) {
            //                $.each(spData.results, function (index, value) {
            //
            //                    var bodyContent = (value.Textkörper) ? NewsModel.formatBodyText(value.Textkörper) : false,
            //                    newsItem = {
            //                        nodeId: value.ID,
            //                        title: value.Titel,
            //                        body: (bodyContent) ? bodyContent["bodyFormatted"] : "",
            //                        bodySearch: (bodyContent) ? bodyContent["bodyFormattedSearch"] : ""
            //                    };
            //
            //                    if (value.LäuftAb) {
            //                        newsItem.expirationDate = utils.parseSharePointDate(value.LäuftAb);
            //                    }
            //
            //                    if (value.Erstellt) {
            //                        newsItem.createdDate = utils.parseSharePointDate(value.Geändert);
            //                    }
            //
            //                     //Parse modified date
            //                     if (value.Geändert) {
            //                        newsItem.spModifiedDate = utils.parseSharePointDate(value.Geändert);
            //                    }
            //
            //persistence.add(new News(newsItem));
            //});

            //                persistence.flush(
            //                                  function () {
            //                                    SyncModel.addSync(NEWS_LIST);
            //                                    $('body').trigger('sync-end');
            //                                    $('body').trigger('news-sync-ready');
            //                                    $('#msgNews').removeClass('in');
            //
            //                                    }
            //                                );
            //            }
            //       });
        },

        formatBodyText: function (body) {

            var $body = $(body);

            //remove links
            try {
                $body.find('a').attr('target', "_system");
                var oldhref = $body.find('a').attr('href');
                var input = "/"
                //check if URL neeeds to be rewritten
                //add sharepoint domain to hyperlink. Atlas uses sharepoint functions to create hyperlinks. these are not comeplete for external users
                if (oldhref.substring(0, input.length) === input) // checks if URL starts with "/"
                {
                    //if so, add http://www.atlas-cms.com/
                    //    console.debug(oldhref);
                    $body.find('a').attr('href', Settings.spContent + oldhref)
                    var newhref = $body.find('a').attr('href');
                    //  console.debug(newhref);
                }




            }
            catch (e)
            { }
            //remove images
            $body.find('img').remove();

            //remove empty paragrafs
            $body.html($body.html().replace(/&nbsp;/g, ""));

            //remove &amp; paragrafs
            $body.html($body.html().replace(/&amp;/g, "&"));
            //replace curly brackets
            $body.html($body.html().replace(/{/g, "%7B"));
            $body.html($body.html().replace(/}/g, "%7D"));


            return {
                bodyFormatted: $body.html(),
                bodyFormattedSearch: $body.text()
            };
        },

        searchNews: function (key) {
            var newsSearch = $.Deferred();
            News.search(key).list(function (res) {
                newsSearch.resolve(res);
            });

            return newsSearch.promise();
        }
    };