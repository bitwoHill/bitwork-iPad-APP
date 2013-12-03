var NEWS_CONTAINER = "#news-items-container",
    NEWS_EMPTY_CONTAINER = "#news-empty-container",
    NEWS_ITEM_TEMPLATE = "#news-item-template",
    URL_SINGLE_NEWS = "http://www.atlas-cms.com/Lists/Ankuendigungen/DispForm.aspx?ID=";

var NewsUI = {
    resetNews : function(){
        $(NEWS_CONTAINER + ' > div').not(NEWS_ITEM_TEMPLATE).not(NEWS_EMPTY_CONTAINER).remove();
    },

    displayNews : function(){
        var $container = $(NEWS_CONTAINER),
            $template = $(NEWS_ITEM_TEMPLATE),
            requestParam = utils.getUrlParameter('newsID');

        if($container.length && $template.length){
            NewsUI.resetNews();

            var newsList = (requestParam !== "")? News.all().filter("nodeId", "=", parseInt(requestParam, 10)) : News.all();

            newsList.order('createdDate', false).list(null, function(results){
                if(results.length){
                    $(NEWS_EMPTY_CONTAINER).addClass('hidden');
                    $.each(results, function(index, value){
                        var data = value._data;
                        var $newItem = $template.clone();

                        $newItem.removeAttr('id');
                        $('.news-item-title', $newItem).html(data.title);
                        $('.news-item-body', $newItem).html(data.body);
                        $('.news-item-date', $newItem).html(utils.dateFormat(new Date(data.createdDate), "d.m.y, H:M"));
                        $('.news-item-link', $newItem).attr('href', URL_SINGLE_NEWS + data.nodeId);

                        //if(data.image) {
                        //    $('.box-content', $newItem).addClass('with-image');
                        //    $('.news-item-image', $newItem).attr('src', data.image);
                        //} else {
                        //    $('.news-item-image', $newItem).addClass('hidden');
                        //}

                        $container.append($newItem.removeClass('hidden'));
                    });
                }
                //no results
                else {
                    $(NEWS_EMPTY_CONTAINER).removeClass('hidden');
                }
            });
        }

        SyncModel.getSyncDate("News", function(date){
            //update last sync date
            $('.page-sync-btn-date').html(date);
            $('.page-sync-btn').removeClass('hidden');
        });
    }
};

(function($){
    //Display news when sync is ready
    $('body').on('news-sync-ready db-schema-ready', NewsUI.displayNews);

    $(document).ready(function(){
        $('body').on('click', 'a.page-sync-btn', function(){
            NewsModel.syncNews();
        });
    })

})(jQuery);
//bind to sync ready event in order to display the news
