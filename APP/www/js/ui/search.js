var SEARCH_CONTAINER = "#search-container";

var SearchUI = {
    displaySearchResults : function(type, results){
        var $resultsContainer = $("#" + type),
            $resultItemTemplate = $("#" + type + "-result-template", $resultsContainer);

        $(".badge-" + type).html(results.length);

        if($resultsContainer.length && $resultItemTemplate.length){
            $.each(results, function(index, value){
                var data = value._data,
                    $newItem = $resultItemTemplate.clone(),
                    link = $newItem.attr('href') + data.nodeId;

                $newItem.removeAttr('id');
                $newItem.attr('href', link);
                $('.result-item-title', $newItem).html(data.title);
                $('.result-item-text', $newItem).html(utils.dateFormat(new Date(data.createdDate), "d.m.y, H:M"));

                $resultsContainer.append($newItem.removeClass('hidden'));
            });
        }
    },

    doSearch : function(){
        var key = utils.getUrlParameter("search");

        if(key && key !== ""){
            var newsSearch = NewsModel.searchNews(key);
            newsSearch.done(function(res){
                SearchUI.displaySearchResults("news", res);
            });
        }
    }
};

(function($){
    //Display news when sync is ready
    $('body').on('db-schema-ready', SearchUI.doSearch);

    $(document).ready(function () {
        $('.search-key-container').html(utils.getUrlParameter("search"));
    });
})(jQuery);
//bind to sync ready event in order to display the news
