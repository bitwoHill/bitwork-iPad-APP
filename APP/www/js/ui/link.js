var LINK_CONTAINER = "#link-items-container",
    LINK_EMPTY_CONTAINER = "#link-empty-container",
    LINK_ITEM_TEMPLATE = "#link-item-template";

var LinkUI = {

    displayLinks : function(){
        var $container = $(LINK_CONTAINER),
            $template = $(LINK_ITEM_TEMPLATE);

        if($container.length && $template.length){
            Link.all().order('description').list(null, function(results){
                if(results.length){
                    $(LINK_EMPTY_CONTAINER).addClass('hidden');
                    $.each(results, function(index, value){
                        var data = value._data;
                        var $newItem = $template.clone();

                        $newItem.removeAttr('id');
                        $('.link-item-description', $newItem).html(data.description);
                        $('.link-item-anchor-label', $newItem).html(data.label);
                        $('.link-item-anchor', $newItem).attr('href', data.linkUrl);

                        $container.append($newItem.removeClass('hidden'));
                    });
                } else {
                    $(LINK_EMPTY_CONTAINER).removeClass('hidden');
                }

            });
        }

        SyncModel.getSyncDate(LINK_LIST, function(date){
            //update last sync date
            $('.page-sync-btn-date').html(date);
            $('.page-sync-btn').removeClass('hidden');
        });
    }
};

(function($){
    //Display news when sync is ready
    $('body').on('link-sync-ready', LinkUI.displayLinks);

    $(document).ready(function(){
        $('body').on('click', 'a.page-sync-btn', function(){
            LinkModel.syncLinks();
        });
    })

})(jQuery);
