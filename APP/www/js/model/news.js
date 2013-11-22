var NEWS_SYNC_URL = Settings.spDomain + "/News",
    NEWS_SYNC_TYPE = "NEWS";

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
    sharePointSync : function(callback){
        $('body').trigger('sync-start');
        var jqXHR = $.ajax({
            type: 'GET',
            url: NEWS_SYNC_URL,
            crossDomain: true,
            username: "bitwork",
            password: "Test1234!",
            dataType: 'json',
            success: function(responseData, textStatus, jqXHR)
            {
                NewsModel.mapSharePointData(responseData.d);
            },
            error: function (responseData, textStatus, errorThrown)
            {
                console.warn(responseData, textStatus, errorThrown);
                $('body').trigger('sync-end', 'sync-error');
            }
        });

    },

    //maps SharePoint data to current model
    mapSharePointData: function(spData){
        console.log(spData.results);
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
                    SyncModel.addSync(NEWS_SYNC_TYPE);
                    $('body').trigger('sync-end');
                    $('body').trigger('news-sync-ready');
                }
            );
        }
    }
};