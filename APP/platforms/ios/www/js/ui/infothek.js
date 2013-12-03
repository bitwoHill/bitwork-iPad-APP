var INFOTHEK_CONTAINER = "#infothek-items-container",
    INFOTHEK_ITEM_TEMPLATE = "#infothek-person-item-template",
    INFOTHEK_FOLDER_TEMPLATE = "#infothek-folder-item-template",
    INFOTHEK_EMPTY_CONTAINER = "#infothek-empty-container";

var InfothekUI = {
    resetInfothek : function(){
        $(INFOTHEK_CONTAINER + " > li").not(INFOTHEK_FOLDER_TEMPLATE).not(INFOTHEK_ITEM_TEMPLATE).remove();
    },

    displayInfothekNavTree : function(){
        var $container = $(INFOTHEK_CONTAINER),
            $templateItem = $(INFOTHEK_ITEM_TEMPLATE),
            $templateFolder = $(INFOTHEK_FOLDER_TEMPLATE),
            $emptyContainer = $(INFOTHEK_EMPTY_CONTAINER);

        if($container.length && $templateFolder.length && $templateItem.length){
            InfothekUI.resetInfothek();

            Infothek.all().filter("parentFolder", "=", 'InfothekHaendler').order('isFolder', false).order('title', true).list(null, function(results){

                if(results.length){
                    $emptyContainer.addClass("hidden");

                    $.each(results, function(index, value){
                        var data = value._data,
                            newItem;

                        if(data.isFolder){
                            newItem = $templateFolder.clone();
                        } else {
                            newItem = $templateItem.clone();
                        }

                        newItem.removeAttr('id');

                        $('.tree-nav-item-name', newItem).html(data.title);
                        $('.tree-nav-link', newItem).attr("data-item-id", data.nodeId);
                        $('.tree-nav-link', newItem).attr("data-item-name", data.title);

                        if(data.path) {
                            $('.tree-nav-link', newItem).attr("href", data.path);
                        }

                        $container.append(newItem.removeClass('hidden'));
                    });
                } else {
                    $emptyContainer.removeClass("hidden");
                }
            });
        }

        SyncModel.getSyncDate(INFOTHEK_LIST, function(date){
            //update last sync date
            $('.page-sync-btn-date').html(date);
            $('.page-sync-btn').removeClass('hidden');
        });
    },

    updateContactTree : function(container, nodeId){
        var $templateItem = $(INFOTHEK_ITEM_TEMPLATE),
            $templateFolder = $(INFOTHEK_FOLDER_TEMPLATE);

        if(container.length && $templateFolder.length && $templateItem.length){
            Infothek.all().filter("parentFolder", "=", nodeId).order('isFolder', false).order('title', true).list(null, function(results){

                $.each(results, function(index, value){
                    var data = value._data,
                        newItem;

                    if(data.isFolder){
                        newItem = $templateFolder.clone();
                    } else {
                        newItem = $templateItem.clone();
                    }

                    newItem.removeAttr('id');

                    $('.tree-nav-item-name', newItem).html(data.title);
                    $('.tree-nav-link', newItem).attr("data-item-id", data.nodeId);
                    $('.tree-nav-link', newItem).attr("data-item-name", data.title);

                    if(data.path) {
                        $('.tree-nav-link', newItem).attr("href", data.path);
                    }

                    container.append(newItem.removeClass('hidden'));
                });
            });
        }
    }
};

$(document).ready(function(){

    $('body').on('infothek-sync-ready db-schema-ready', InfothekUI.displayInfothekNavTree);

    $('body').on('click', 'a.page-sync-btn', function(e){
        e.preventDefault();
        InfothekModel.syncInfothek();
    });

    $('body').on('click', '.tree-nav-link.folder', function(e){
        e.preventDefault();
        var $this = $(this),
            nodeId = $this.attr("data-item-name"),
            container = $this.siblings("ul.tree-nav"),
            $icon = $('.fa', $this);

        if(container.length && $('li', container).length === 0){
            InfothekUI.updateContactTree(container, nodeId);
        }

        $this.siblings("ul.tree-nav").toggle(300);
        $this.toggleClass("collapsed");

        if($icon.hasClass('fa-folder')){
            $icon.removeClass('fa-folder').addClass('fa-folder-open');
        } else {
            $icon.removeClass('fa-folder-open').addClass('fa-folder');
        }
    });
});