var SEARCH_CONTAINER = "#search-container";

var SearchUI = {
    createNewsItem : function(template, data) {
        var $newItem = template.clone(),
            link = $newItem.attr('href') + data.nodeId;

        $newItem.removeAttr('id');
        $newItem.attr('href', link);
        $('.result-item-title', $newItem).html(data.title);
        $('.result-item-text', $newItem).html(utils.dateFormat(new Date(data.createdDate), "d.m.y, H:M"));

        return $newItem.removeClass('hidden');
    },

    createCalendarItem : function(template, data) {
        var $newItem = template.clone(),
            link = $newItem.attr('href') + data.nodeId;

        $newItem.removeAttr('id');
        $newItem.attr('href', link);
        $('.result-item-title', $newItem).html(data.title);
        $('.result-item-text', $newItem).html(utils.dateFormat(new Date(data.startDate), "l, d F y, H:M"));

        return $newItem.removeClass('hidden');
    },

    createContactItem : function(template, data) {
        var $newItem = template.clone(),
            link = $newItem.attr('href') + data.contactId;

        $newItem.removeAttr('id');
        $newItem.attr('href', link);
        $('.result-item-title-text', $newItem).html(data.name + " " + data.forename);
        if(data.jobFunction){
            $('.result-item-text', $newItem).html(data.jobFunction);
        } else {
            $('.result-item-text', $newItem).addClass('hidden');
        }

        if(data.isFolder) {
            $('.result-item-title > span.fa', $newItem).addClass("fa-folder");
        } else {
            $('.result-item-title > span.fa', $newItem).addClass("fa-user");
        }

        return $newItem.removeClass('hidden');
    },

    createInfothekItem : function(template, data) {
        var $newItem = template.clone(),
            link = $newItem.attr('href') + data.nodeId;

        $newItem.removeAttr('id');
        $newItem.attr('href', link);
        $('.result-item-title-text', $newItem).html(data.title);

        if(data.isFolder) {
            $('.result-item-title > span.fa', $newItem).addClass("fa-folder");
        } else {
            $('.result-item-title > span.fa', $newItem).addClass("fa-file-o");
        }

        return $newItem.removeClass('hidden');
    },

    displayResults : function(type, results){
        var $resultsContainer = $("#" + type),
            $resultsEmptyTemplate = $("#" + type + "-empty-container"),
            $resultItemTemplate = $("#" + type + "-result-template", $resultsContainer);

        $(".badge-" + type).html(results.length).removeClass('hidden');

        if($resultsContainer.length && $resultItemTemplate.length && $resultsEmptyTemplate){
            if(results.length){
                $resultsEmptyTemplate.addClass('hidden');
                $.each(results, function(index, value){
                    var data = value._data,
                        $newItem;

                    switch (type){
                        case "news":
                            $newItem = SearchUI.createNewsItem($resultItemTemplate, data);
                            break;
                        case "calendar":
                            $newItem = SearchUI.createCalendarItem($resultItemTemplate, data);
                            break;
                        case "contacts":
                            $newItem = SearchUI.createContactItem($resultItemTemplate, data);
                            break;
                        case "infothek":
                            $newItem = SearchUI.createInfothekItem($resultItemTemplate, data);
                            break;
                        default:
                            $newItem = SearchUI.createNewsItem($resultItemTemplate, data);
                    }

                    $resultsContainer.append($newItem);
                });
            } else {
                $resultsEmptyTemplate.removeClass('hidden');
            }
        }
    },

    doSearch : function(){
        var key = utils.getUrlParameter("search");

        if(key && key !== ""){
            var newsSearch = NewsModel.searchNews(key);
            newsSearch.done(function(res){
                SearchUI.displayResults("news", res);
            });

            var calendarSearch = CalendarModel.searchCalendar(key);
            calendarSearch.done(function(res){
                SearchUI.displayResults("calendar", res);
            });

            var contactsSearch = ContactsModel.searchContact(key);
            contactsSearch.done(function(res){
                SearchUI.displayResults("contacts", res);
            });

            var infothekSearch = InfothekModel.searchInfothek(key);
            infothekSearch.done(function(res){
                SearchUI.displayResults("infothek", res);
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
