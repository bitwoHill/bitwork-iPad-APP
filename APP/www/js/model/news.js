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
        $body.find('a').remove();

        //remove images
        $body.find('img').remove();

        //remove empty paragrafs
        $body.html($body.html().replace(/&nbsp;/g, ""));

        return $body.html();
    }
};