var NEWS_CONTAINER = "#news-items-container",
    NEWS_ITEM_TEMPLATE = "#news-item-template";

var NewsUI = {
    displayNews : function(){
        var $container = $(NEWS_CONTAINER),
            $template = $(NEWS_ITEM_TEMPLATE);

        if($container.length && $template.length){
            News.all().order('createdDate', false).list(null, function(results){
                $.each(results, function(index, value){
                    var data = value._data;
                    var $newItem = $template.clone();

                    $newItem.removeAttr('id');
                    $('.news-item-title', $newItem).html(data.title);
                    $('.news-item-body', $newItem).html(data.body);
                    $('.news-item-date', $newItem).html(utils.dateFormat(new Date(data.createdDate), "m.d.y, H:M"));
                    $('.news-item-link', $newItem).attr('href', 'http://www.atlas-cms.com/Lists/Ankuendigungen/DispForm.aspx?ID=' + data.nodeId);
  
  //$('.news-item-link', $newItem).attr('target', '_system');
  
  
  //set external url calls to be opened in a new window
  $("a[href^='http']").attr('target','_system');
  
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

        SyncModel.getSyncDate("NEWS", function(date){
            //update last sync date
            $('.page-sync-btn-date').html(date);
            $('.page-sync-btn').removeClass('hidden');
        });
    }
};

(function($){
    //Display news when sync is ready
    $('body').on('news-sync-ready', NewsUI.displayNews);

    $(document).ready(function(){
        $('body').on('click', 'a.page-sync-btn', function(){
            NewsModel.sharePointSync();
        });
    })

})(jQuery);
//bind to sync ready event in order to display the news
