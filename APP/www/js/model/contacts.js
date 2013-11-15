var CONTACTS_SYNC_URL = "content/contacts.json",
    CONTACTS_CONTAINER = "#contact-items-container",
    CONTACTS_ITEM_TEMPLATE = "#contact-item-template";

var ContactsUtils = {
    sharePointSync : function(callback){

        //TODO: replace with sharepoint connection
        $.getJSON(CONTACTS_SYNC_URL, function(data){

            $.each(data, function(index, value){
                var contactItem = new Contacts(value);
                persistence.add(contactItem);
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
                alert("Contacts: Mock data read error.");

                if(typeof callback === "function") {
                    callback();
                }
            }
        );
    },

    displayLinks : function(){
        var $container = $(CONTACTS_CONTAINER),
            $template = $(CONTACTS_ITEM_TEMPLATE);

        if($container.length && $template.length){

            Contacts.all().list(null, function(results){
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

$(document).ready(function(){

    $(".tree-nav-link.folder").click(function(e){
        e.preventDefault();
        $(this).siblings("ul.tree-nav").toggleClass("hidden");
        $(this).toggleClass("collapsed");
    });

    $(".tree-nav-link").not(".folder").click(function(e){
        e.preventDefault();

        $('.cotact-details-container').show(300);
    });
})