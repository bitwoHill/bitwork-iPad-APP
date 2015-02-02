var INFOTHEK_CONTAINER = "#infothek-items-container",
    INFOTHEK_ITEM_TEMPLATE = "#infothek-person-item-template",
    INFOTHEK_FOLDER_TEMPLATE = "#infothek-folder-item-template",
    INFOTHEK_EMPTY_CONTAINER = "#infothek-empty-container",
    INFOTHEK_ROOT_FOLDER =  "/Infothek",
    localFileSystemRoot;

var InfothekUI = {
    resetInfothek: function () {
        $(INFOTHEK_CONTAINER + " > li").not(INFOTHEK_FOLDER_TEMPLATE).not(INFOTHEK_ITEM_TEMPLATE).remove();
    },

    displayInfothekNavTree: function () {
        var $container = $(INFOTHEK_CONTAINER),
            $templateItem = $(INFOTHEK_ITEM_TEMPLATE),
            $templateFolder = $(INFOTHEK_FOLDER_TEMPLATE),
            $emptyContainer = $(INFOTHEK_EMPTY_CONTAINER);
INFOTHEK_ROOT_FOLDER = Settings.spWebName +  "/Infothek";
        if ($container.length && $templateFolder.length && $templateItem.length) {
            InfothekUI.resetInfothek();

            Infothek.all().filter("parentFolder", "=", INFOTHEK_ROOT_FOLDER).order('isFolder', false).order('title', true).list(null, function (results) {

                if (results.length) {
                    $emptyContainer.addClass("hidden");

                    $.each(results, function (index, value) {
                        var newItem = InfothekUI.createTreeNavItem($templateItem, $templateFolder, value._data);

                        $container.append(newItem.removeClass('hidden'));
                    });
                } else {
                    $emptyContainer.removeClass("hidden");
                }
            });
        }

        SyncModel.getSyncDate(INFOTHEK_LIST, function (date) {
            //update last sync date
            $('.page-sync-btn-date').html(date);
            $('.page-sync-btn').removeClass('hidden');
        });
    },

    updateContactTree: function (container, nodeId) {
        var $templateItem = $(INFOTHEK_ITEM_TEMPLATE),
            $templateFolder = $(INFOTHEK_FOLDER_TEMPLATE);

        if (container.length && $templateFolder.length && $templateItem.length) {
            Infothek.all().filter("parentFolder", "=", nodeId).order('isFolder', false).order('title', true).list(null, function (results) {

                $.each(results, function (index, value) {
                    var newItem = InfothekUI.createTreeNavItem($templateItem, $templateFolder, value._data);

                    container.append(newItem.removeClass('hidden'));
                });
            });
        }
    },

    createTreeNavItem: function ($templateItem, $templateFolder, data) {
        var newItem;

        if (data.isFolder) {
            newItem = $templateFolder.clone();
        } else {
            newItem = $templateItem.clone();
        }

        newItem.removeAttr('id');

        $('.tree-nav-item-name', newItem).html(data.title);
        // $('.tree-nav-item-path', newItem).html(data.path);
        $('.tree-nav-link', newItem).attr("data-item-id", data.nodeId);
        $('.tree-nav-link', newItem).attr("data-item-name", data.title);
$('.tree-nav-link', newItem).attr("data-item-path", data.path);

        //create instance of local filesystem if not allready created
        if (!localFileSystemRoot) {

            try {
                window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                    function (fileSystem) {
                        localFileSystemRoot = fileSystem.root.fullPath;



                        if (data.localPath) {
                            $('.tree-nav-link', newItem).click(function () { LaunchFile('file://' + localFileSystemRoot + "/Infothek/" + data.localPath); });
                            //  console.debug(localFileSystemRoot + "/Infothek/" + data.localPath);


                        }
                        else //show that no file is available
                        {
                            if (!data.isFolder) {
                                 $('.tree-nav-link', newItem).attr('href', 'http://www.atlas-cms.com' + data.path);
                                $('.tree-nav-item-name', newItem).html(data.title + ' <span class="label label-default"> Nicht Heruntergeladen</span>');
                            }
                        }

                    },
                    function () {
                        console.log("could not create filesystem");
                        if (!data.isFolder) {
                            $('.tree-nav-link', newItem).attr('href', 'http://www.atlas-cms.com' + data.path);
                            $('.tree-nav-item-name', newItem).html(data.title + ' <span class="label label-default"> Nicht Heruntergeladen</span>');
                        }
                    }
                );
            } catch (err) {
                console.log(err);
                if (!data.isFolder) {
                    $('.tree-nav-link', newItem).attr('href', 'http://www.atlas-cms.com' + data.path);
                    $('.tree-nav-item-name', newItem).html(data.title + ' <span class="label label-default"> Nicht Heruntergeladen</span>');
                }
            }
        }
        else
        {
            if (!data.isFolder) {
                if (data.localPath) {
                    $('.tree-nav-link', newItem).click(function () { LaunchFile('file://' + localFileSystemRoot + "/Infothek/" + data.localPath); });
                    //  console.debug(localFileSystemRoot + "/Infothek/" + data.localPath);


                }
                else //show that no file is available
                {
                    if (!data.isFolder) {
                           $('.tree-nav-link', newItem).attr('href', 'http://www.atlas-cms.com' + data.path);
                        $('.tree-nav-item-name', newItem).html(data.title + ' <span class="label label-default"> Nicht Heruntergeladen</span>');

                    }
                }
            }
        }




        return newItem;
    },

    displayInfothekNode: function (nodeID) {
        var $container = $(INFOTHEK_CONTAINER),
            $templateItem = $(INFOTHEK_ITEM_TEMPLATE),
            $templateFolder = $(INFOTHEK_FOLDER_TEMPLATE),
            $emptyContainer = $(INFOTHEK_EMPTY_CONTAINER);

        if ($container.length && $templateFolder.length && $templateItem.length) {
            InfothekUI.resetInfothek();

            Infothek.all().filter("nodeId", "=", nodeID).list(null, function (results) {

                if (results.length) {
                    $emptyContainer.addClass("hidden");

                    InfothekUI.updateContactTree($container, results[0]._data.parentFolder);

                } else {
                    $emptyContainer.removeClass("hidden");
                }
            });
        }
    }
};

$(document).ready(function () {

    $('body').on('infothek-sync-ready db-schema-ready', function () {
        var requestParam = utils.getUrlParameter('infothekID');

        if (requestParam !== "") {
            InfothekUI.displayInfothekNode(parseInt(requestParam));
        } else {
            InfothekUI.displayInfothekNavTree();
        }
    });

    $('body').on('click', 'a.page-sync-btn', function (e) {
        e.preventDefault();
          var networkState = navigator.connection.type;
        if (networkState != Connection.NONE) {
        InfothekModel.syncInfothek();
    }
     else {
                alert("Sie sind nicht mit dem Internet verbunden. Der Vorgang wird abgebrochen.");
            }
    });

    $('body').on('click', '.tree-nav-link.folder', function (e) {
        e.preventDefault();
        var $this = $(this),
            nodeId = $this.attr("data-item-path"),
            container = $this.siblings("ul.tree-nav"),
            $icon = $('.fa', $this);


        if (container.length && $('li', container).length === 0) {
            InfothekUI.updateContactTree(container, nodeId);
        }

        $this.siblings("ul.tree-nav").toggle(300);
        $this.toggleClass("collapsed");

        if ($icon.hasClass('fa-folder')) {
            $icon.removeClass('fa-folder').addClass('fa-folder-open');
        } else {
            $icon.removeClass('fa-folder-open').addClass('fa-folder');
        }
    });
});