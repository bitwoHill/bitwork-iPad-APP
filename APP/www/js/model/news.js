var NEWS_SYNC_URL = "content/news.json",
    NEWS_CONTAINER = "#news-items-container",
    NEWS_ITEM_TEMPLATE = "#news-item-template";

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
    },

    displayNews : function(){
        var $container = $(NEWS_CONTAINER),
            $template = $(NEWS_ITEM_TEMPLATE);

        if($container.length && $template.length){
            News.all().list(null, function(results){
                $.each(results, function(index, value){
                    var data = value._data;
                    var $newItem = $template.clone();

                    $newItem.removeAttr('id');
                    $('.news-item-title', $newItem).html(data.title);
                    $('.news-item-body', $newItem).html(data.body);
                    //if(data.image) {
                    //    $('.box-content', $newItem).addClass('with-image');
                    //    $('.news-item-image', $newItem).attr('src', data.image);
                    //} else {
                    //    $('.news-item-image', $newItem).addClass('hidden');
                    //}

                    $container.append($newItem.removeClass('hidden'));
                });
            });
        }
    }
};

//bind to sync ready event in order to display the news
$('body').on('news-sync-ready', NewsUtils.displayNews);