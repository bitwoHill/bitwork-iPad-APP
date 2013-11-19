var NEWS_CONTAINER = "#news-items-container",
    NEWS_ITEM_TEMPLATE = "#news-item-template";

var NewsUI = {
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
$('body').on('news-sync-ready', NewsUI.displayNews);