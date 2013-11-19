var NEWS_SYNC_URL = "content/news.json";

//DB model
var News = persistence.define('News', {
    nodeId: "INT",
    title: "TEXT",
    body: "TEXT",
    image: "TEXT",
    expirationDate: "DATE"
});

News.index('nodeId', { unique: true });

var NewsModel = {
    sharePointSync : function(callback){

        //TODO: replace with sharepoint connection
        $.getJSON(NEWS_SYNC_URL, function(data){

            $.each(data, function(index, value){
                var newsItem,
                    tmp = (value.image)? value.image.split('.') : false,
                    imageExtension = (tmp && tmp.length > 1)? (tmp[tmp.length - 1]).toLowerCase() : false;

                //save image date if exists
                if(imageExtension && (imageExtension === 'png' || imageExtension === 'jpg')){
                    var img = new Image();
                    img.src = value.image;
                    img.onload = function(){
                        value.image = utils.getBase64FromImage(img, imageExtension);
                        newsItem = new News(value);
                        persistence.add(newsItem);
                    };
                } else {
                    value.image = "";
                    newsItem = new News(value);
                    persistence.add(newsItem);
                }
            });

            persistence.flush(
                function(){
                    //DB is updated - trigger custom event
                    if(typeof callback === "function"){
                        callback();
                    }

                    $('body').trigger('news-sync-ready');
                }
            );
        }).fail(
            function(){
                //TODO: error handling if necessary
                alert("News: Mock data read error.");

                if(typeof callback === "function") {
                    callback();
                }
            }
        );
    }
};