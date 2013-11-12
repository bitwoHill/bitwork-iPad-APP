var NEWS_SYNC_URL = "/content/news.json";

var NewsUtils = {
    sharePointSync : function(callback){

        //TODO: replace with sharepoint connection
        $.getJSON(NEWS_SYNC_URL, function(data){

            $.each(data, function(index, value){
                var newsItem,
                    tmp = (value.image)? value.image.split('.') : false,
                    imageExtension = (tmp && tmp.length > 1)? (tmp[tmp.length - 1]).toLowerCase() : false;

                //save image date if exists
                if(imageExtension && (imageExtension === 'png' || imageExtension === 'jpg')){
                    img = new Image();
                    img.src = value.image;
                    img.onload = function(){
                        value.image = utils.getBase64FromImage(img);
                        newsItem = new News(value);
                        persistence.add(newsItem);
                    };
                } else {
                    value.image = "";
                    newsItem = new News(value);
                    persistence.add(newsItem);
                }
            });

            persistence.flush((typeof callback === "function")? callback : "");
        });
    }
};