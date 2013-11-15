var LINK_SYNC_URL = "content/links.json",
    LINK_CONTAINER = "#link-items-container",
    LINK_ITEM_TEMPLATE = "#link-item-template";

var LinkUtils = {
    sharePointSync : function(callback){

        //TODO: replace with sharepoint connection
        $.getJSON(LINK_SYNC_URL, function(data){

            $.each(data, function(index, value){
                var linkItem = new Link(value);
                persistence.add(linkItem);
            });

            persistence.flush(
                function(){
                    //DB is updated - trigger custom event
                    if(typeof callback === "function"){
                        callback();
                    }

                    $('body').trigger('link-sync-ready');
                }
            );
        }).fail(
            function(){
                //TODO: error handling if necessary
                alert("Links: Mock data read error.");

                if(typeof callback === "function") {
                    callback();
                }
            }
        );
    },

    displayLinks : function(){
        var $container = $(LINK_CONTAINER),
            $template = $(LINK_ITEM_TEMPLATE);

        if($container.length && $template.length){
            Link.all().list(null, function(results){
                $.each(results, function(index, value){
                    var data = value._data;
                    var $newItem = $template.clone();

                    $newItem.removeAttr('id');
                    $('.link-item-anchor-label', $newItem).html(data.label);
                    $('.link-item-anchor', $newItem).attr('href', data.linkUrl);

                    if(data.description){
                        $('.link-item-description', $newItem).html(data.description);
                    } else {
                        $('.link-item-description', $newItem).addClass('hidden');
                    }

                    $container.append($newItem.removeClass('hidden'));
                });
            });
        }
    }
};

//bind to sync ready event in order to display the news
$('body').on('news-sync-ready', LinkUtils.displayLinks);