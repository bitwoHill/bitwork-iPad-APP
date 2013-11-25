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
        if(spData && spData.results.length){
            $.each(spData.results, function(index, value){
                var newsItem = {
                    nodeId : value.ID,
                    title : value.Titel,
                    body : $(value.Textkörper).text()
                };

                if(value.LäuftAb) {
                    newsItem.expirationDate = utils.parseSharePointDate(value.LäuftAb);
                }

                if(value.Erstellt) {
                    newsItem.createdDate = utils.parseSharePointDate(value.Erstellt);
                }

                persistence.add(new News(newsItem));
            });

            persistence.flush(
                function(){
                    SyncModel.addSync(NEWS_LIST);
                    $('body').trigger('sync-end');
                    $('body').trigger('news-sync-ready');
                }
            );
        }
    }
};