var NEWS_LIST = "News";

//DB model
var News = persistence.define('News', {
    nodeId: "INT",
    title: "TEXT",
    body: "TEXT",
    image: "TEXT",
    expirationDate: "DATE",
    createdDate: "DATE"
});

News.index('nodeId', { unique: true });
News.textIndex('title');
News.textIndex('body');

var NewsModel = {
    syncNews : function(){
        $('body').trigger('sync-start');

        SharePoint.sharePointRequest(NEWS_LIST, NewsModel.mapSharePointData);
    },

    //maps SharePoint data to current model
    mapSharePointData: function(data){
        var spData = data.d;
        //wipe database of old entries
        News.all().destroyAll(function (ele) { 
            if (spData && spData.results.length) {
                $.each(spData.results, function (index, value) {
                
                    var newsItem = {
                        nodeId: value.ID,
                        title: value.Titel,
                        body: NewsModel.formatBodyText(value.Textkörper)
                    };

                    if (value.LäuftAb) {
                        newsItem.expirationDate = utils.parseSharePointDate(value.LäuftAb);
                    }

                    if (value.Erstellt) {
                        newsItem.createdDate = utils.parseSharePointDate(value.Erstellt);
                    }


                    persistence.add(new News(newsItem));
                });

                persistence.flush(
                    function () {
                        SyncModel.addSync(NEWS_LIST);
                        $('body').trigger('sync-end');
                        $('body').trigger('news-sync-ready');
                    }
                );
            }
        });
    },

    formatBodyText : function(body){

        var $body = $(body);
    
        //remove links
        try
        {
            $body.find('a').attr('target', "_system");
            var oldhref = $body.find('a').attr('href');
            var input = "/"
            //check if URL neeeds to be rewritten
            //add sharepoint domain to hyperlink. Atlas uses sharepoint functions to create hyperlinks. these are not comeplete for external users
            if (oldhref.substring(0, input.length) === input) // checks if URL starts with "/"
            {
                //if so, add http://www.atlas-cms.com/
                console.debug(oldhref);
                $body.find('a').attr('href', Settings.spContent + oldhref)
                var newhref = $body.find('a').attr('href');
                console.debug(newhref);
            }



         
        }
        catch (e)
        { }
        //remove images
        $body.find('img').remove();

        //remove empty paragrafs
        $body.html($body.html().replace(/&nbsp;/g, ""));
   

        return $body.html();
    },

    searchNews: function(key){
        var newsSearch = $.Deferred();
        News.search(key).list(function(res){
            newsSearch.resolve(res);
        });

        return newsSearch.promise();
    }
};