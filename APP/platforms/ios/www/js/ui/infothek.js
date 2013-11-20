var INFOTHEK_CONTAINER = "#infothek-items-container",
    INFOTHEK_ITEM_TEMPLATE = "#infothek-person-item-template",
    INFOTHEK_FOLDER_TEMPLATE = "#infothek-folder-item-template";

var InfothekUI = {

    displayInfothekNavTree : function(){
        var $container = $(INFOTHEK_CONTAINER),
            $templateItem = $(INFOTHEK_ITEM_TEMPLATE),
            $templateFolder = $(INFOTHEK_FOLDER_TEMPLATE);

        if($container.length && $templateFolder.length && $templateItem.length){

            Infothek.all().filter("parentFolder", "=", 0).order('isFolder', false).order('title', true).list(null, function(results){

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

                    if(data.path) {
                        $('.tree-nav-link', newItem).attr("href", data.path);
                    }

                    $container.append(newItem.removeClass('hidden'));
                });
            });
        }
    },

    updateContactTree : function(container, nodeId){
        var $templateItem = $(INFOTHEK_ITEM_TEMPLATE),
            $templateFolder = $(INFOTHEK_FOLDER_TEMPLATE);

        if(container.length && $templateFolder.length && $templateItem.length){
            Infothek.all().filter("parentFolder", "=", parseInt(nodeId, 10)).order('isFolder', false).order('title', true).list(null, function(results){

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

                    if(data.path) {
                        $('.tree-nav-link', newItem).attr("href", data.path);
                    }

                    container.append(newItem.removeClass('hidden'));
                });
            });
        }
    }
};

//bind to sync ready event in order to display the news
$('body').on('infothek-sync-ready', InfothekUI.displayInfothekNavTree);

$(document).ready(function(){

    $('body').on('click', '.tree-nav-link.folder', function(e){
        e.preventDefault();
        var $this = $(this),
            nodeId = $this.attr("data-item-id"),
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