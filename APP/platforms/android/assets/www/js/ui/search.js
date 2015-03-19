var SEARCH_CONTAINER = "#search-container";

var SearchUI = {
    createNewsItem : function(template, data) {
        var $newItem = template.clone(), link = $newItem.attr('href') + data.nodeId;

        $newItem.removeAttr('id');
        $newItem.attr('href', link);
        $('.result-item-title', $newItem).html(SearchUI.highlightSearchKey(data.title, utils.getUrlParameter("search")));
        $('.result-item-text', $newItem).html(utils.dateFormat(new Date(data.createdDate), "d.m.y, H:M"));

        return $newItem.removeClass('hidden');
    },

    createCalendarItem : function(template, data) {
        var $newItem = template.clone(), link = $newItem.attr('href') + data.nodeId;

        $newItem.removeAttr('id');
        $newItem.attr('href', link);
        $('.result-item-title', $newItem).html(SearchUI.highlightSearchKey(data.title, utils.getUrlParameter("search")));
        $('.result-item-text', $newItem).html(utils.dateFormat(new Date(data.startDate), "l, d F y, H:M"));

        return $newItem.removeClass('hidden');
    },

    createContactItem : function(template, data) {
        var $newItem = template.clone(), link = $newItem.attr('href') + data.contactId;

        $newItem.removeAttr('id');
        $newItem.attr('href', link);
        $('.result-item-title-text', $newItem).html(SearchUI.highlightSearchKey(data.forename, utils.getUrlParameter("search")) + " " + SearchUI.highlightSearchKey(data.name, utils.getUrlParameter("search")));
        if (data.jobFunction) {
            $('.result-item-text', $newItem).html(SearchUI.highlightSearchKey(data.jobFunction, utils.getUrlParameter("search")));
        } else {
            $('.result-item-text', $newItem).addClass('hidden');
        }

        if (data.isFolder) {
            $('.result-item-title > span.fa', $newItem).addClass("fa-folder");
        } else {
            $('.result-item-title > span.fa', $newItem).addClass("fa-user");
        }

        return $newItem.removeClass('hidden');
    },

    createInfothekItem : function(template, data) {
        var $newItem = template.clone(), link;
        //generate hyperlink to local path

        if (data.localPath) {
            //create path to filesystem needed for infothek and documents
            var localFileSystemRootSearchJs;

            try {
                window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                    //created filesystem path. use it
                    localFileSystemRootSearchJs = fileSystem.root.fullPath;
                    //create hyperlink to local file

                    //link = $newItem.click(function () { window.open(localFileSystemRootSearchJs + "/Infothek/" + data.localPath, '_blank','EnableViewPortScale=yes', 'location=yes'); });
                    link = $newItem.click(function() {
                        LaunchFile('file://' + localFileSystemRootSearchJs + "/Infothek/" + data.localPath);
                    });

                    $('.result-item-title-text', $newItem).html(SearchUI.highlightSearchKey(data.title, utils.getUrlParameter("search")));
                }, function() {
                    console.log("could not create filesystem");

                    link = 'http://www.atlas-cms.com' + data.path;
                    $('.result-item-title-text', $newItem).html(SearchUI.highlightSearchKey(data.title, utils.getUrlParameter("search")) + "  <span class='label label-default'> Nicht Heruntergeladen</span>");
                });
            } catch (err) {
                console.log(err);
            }

        } else {
            link = 'http://www.atlas-cms.com' + data.path;
            $('.result-item-title-text', $newItem).html(SearchUI.highlightSearchKey(data.title, utils.getUrlParameter("search")) + "   <span class='label label-default'> Nicht Heruntergeladen</span>");
        }

        $newItem.removeAttr('id');
        $newItem.attr('href', link);
             $newItem.attr('target', '_system');

        return $newItem.removeClass('hidden');

    },
    createEquipmentproductItem : function(template, data) {

        //attach piecenumber and searchpar to url. Piecenumber is needed to find the object, searchpar is needed for backwards navigation
        var $newItem = template.clone(), searchKey = utils.getUrlParameter("search"), link = $newItem.attr('href') + data.pieceNumber + "&SearchPar=" + searchKey;

        $newItem.removeAttr('id');
        $newItem.attr('href', link);

        $('.result-item-title-text', $newItem).html(SearchUI.highlightSearchKey(data.productDescription, searchKey));
        $('.result-item-text', $newItem).html(SearchUI.highlightSearchKey(data.pieceNumber, searchKey));

        return $newItem.removeClass('hidden');
    },
    createDocument : function(template, data) {

        var $newItem = template.clone(), link;
        //generate hyperlink to local path

        if (data.localPath) {
            //create path to filesystem needed for infothek and documents
            var localFileSystemRootSearchJs;

            try {
                window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                    //created filesystem path. use it
                    localFileSystemRootSearchJs = fileSystem.root.fullPath;
                    //create hyperlink to local file

                    //   link = $newItem.click(function () { window.open(localFileSystemRootSearchJs + "/Dokumente/" + data.localPath, '_blank','EnableViewPortScale=yes', 'location=yes'); });
                    console.log("file://" + localFileSystemRootSearchJs + "/Dokumente/" + data.localPath);
                    link = $newItem.click(function() {
                        LaunchFile("file://" + localFileSystemRootSearchJs + "/Dokumente/" + data.localPath);
                    });

                    $('.result-item-title-text', $newItem).html(SearchUI.highlightSearchKey(data.documentname, utils.getUrlParameter("search")));
                }, function() {
                    console.log("could not create filesystem");

                  link = 'http://www.atlas-cms.com' + data.path;
                    $('.result-item-title-text', $newItem).html(SearchUI.highlightSearchKey(data.documentname, utils.getUrlParameter("search")) + " <span class='label label-default'> Nicht Heruntergeladen</span>");
                });
            } catch (err) {
                console.log(err);
            }

        } else {
            link = 'http://www.atlas-cms.com' + data.path;
            $('.result-item-title-text', $newItem).html(SearchUI.highlightSearchKey(data.documentname, utils.getUrlParameter("search")) + " <span class='label label-default'> Nicht Heruntergeladen</span>");
        }

        $newItem.removeAttr('id');
        $newItem.attr('href', link);
          $newItem.attr('target', '_system');
    

        return $newItem.removeClass('hidden');
    },

    //highlightSearchKey: function (text, term) {
    //    term = term.replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
    //    var pattern = new RegExp("(" + term + ")", "i");

    //    text = text.replace(pattern, "<mark>$1</mark>");
    //    text = text.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/g, "$1</mark>$2<mark>$4");
    //    return text;

    //},

    highlightSearchKey : function(text, term) {
        //term = term.replace(/(\s+)/g, "(<[^>]+>)*$1(<[^>]+>)*");
        var pattern;
        //= new RegExp("(" + term + ")", "i");

        //split term into several words
        var terms = term.split(" ");

        for ( index = 0; index < terms.length; ++index) {
            var tmpterm = terms[index];

            tmpterm = tmpterm.replace(/(\s+)/g, "(<[^>]+>)*$1(<[^>]+>)*");
            pattern = new RegExp("(" + tmpterm + ")", "ig");
            text = text.replace(pattern, "<mark>$1</mark>");
        }

        return text;
    },

    displayResults : function(type, results, additionalBadgeCount) {
        //overwrite MPL-Other Products to be displayed in MPL list as well
        var BadgeCount = results.length;

        if (type == "mpl-other") {
            type = "mpl";
            if (additionalBadgeCount) {
                BadgeCount = BadgeCount + additionalBadgeCount;
            }
        }

        var $resultsContainer = $("#" + type), $resultsEmptyTemplate = $("#" + type + "-empty-container"), $resultItemTemplate = $("#" + type + "-result-template", $resultsContainer);
        $(".badge-" + type).html(BadgeCount).removeClass('hidden');

        if ($resultsContainer.length && $resultItemTemplate.length && $resultsEmptyTemplate) {
            if (BadgeCount) {
                $resultsEmptyTemplate.addClass('hidden');
                $.each(results, function(index, value) {
                    var data = value._data, $newItem;

                    switch (type) {
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
                        case "mpl":
                            $newItem = SearchUI.createEquipmentproductItem($resultItemTemplate, data);
                            break;
                        case "documents":
                            $newItem = SearchUI.createDocument($resultItemTemplate, data);
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

    doSearch : function() {
        var key = utils.getUrlParameter("search"), tmp = (key && key.indexOf("*") === -1) ? key.split(" ") : "";

        if (tmp.length == 1) {
            key = key + "*";
        }

        if (key && key !== "") {
            var newsSearch = NewsModel.searchNews(key);
            newsSearch.done(function(res) {
                SearchUI.displayResults("news", res);
            });

            var calendarSearch = CalendarModel.searchCalendar(key);
            if (calendarSearch) {
                calendarSearch.done(function(res) {
                    SearchUI.displayResults("calendar", res);
                });
            }

            var contactsSearch = ContactsModel.searchContact(key);
            contactsSearch.done(function(res) {
                SearchUI.displayResults("contacts", res);
            });

            var infothekSearch = InfothekModel.searchInfothek(key);
            infothekSearch.done(function(res) {
                SearchUI.displayResults("infothek", res);
            });

            var documentSearch = documentsModel.searchDocuments(key);
            documentSearch.done(function(res) {
                SearchUI.displayResults("documents", res);
            });

            var equipmentProductSearch = equipmentproductsModel.searchEquipmentproduct(key);
            //search for both Equipment and Other Products
            var additionalbatchcount = 0;//workaround for badge disploay
            equipmentProductSearch.done(function(res) {
                additionalbatchcount = res.length;
                SearchUI.displayResults("mpl", res);
                var otherProductSearch = otherproductsModel.searchOtherproduct(key);
                otherProductSearch.done(function(res) {
                    SearchUI.displayResults("mpl-other", res, additionalbatchcount);
                });
            });

        }
    }
};

(function($) {
    //Display news when sync is ready
    $('body').on('db-schema-ready', SearchUI.doSearch);

    $(document).ready(function() {
        $('.search-key-container').html(utils.getUrlParameter("search"));
    });
})(jQuery);
//bind to sync ready event in order to display the news
