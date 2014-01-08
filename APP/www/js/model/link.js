var LINK_LIST = "WichtigeLinks";

//DB model
var Link = persistence.define('Link', {
    linkId: "INT",
    label: "TEXT",
    linkUrl: "TEXT",
    description: "TEXT"
});

Link.index('linkId', { unique: true });

var LinkModel = {

    syncLinks: function () {
        $('body').trigger('sync-start');

        SharePoint.sharePointRequest(LINK_LIST, LinkModel.mapSharePointData);
    },

    //maps SharePoint data to current model
    mapSharePointData: function (data) {
        var spData = data.d;
        Link.all().destroyAll(function (ele) {
            if (spData && spData.results.length) {
                $.each(spData.results, function (index, value) {
                    var linkItem = {
                        linkId: value.ID,
                        description: (value.Link) ? value.Link : ""
                    },
                        tmpUrl;

                    if (value.URL) {
                        tmpUrl = value.URL.split(",");
                        if (tmpUrl.length > 1) {
                            linkItem.label = $.trim(tmpUrl[1]);
                            linkItem.linkUrl = $.trim(tmpUrl[0]);
                        } else {
                            linkItem.label = value.URL;
                            linkItem.linkUrl = value.URL;
                        }
                    }

                    persistence.add(new Link(linkItem));
                });

                persistence.flush(
                    function () {
                        SyncModel.addSync(LINK_LIST);
                        $('body').trigger('sync-end');
                        $('body').trigger('link-sync-ready');
                    }
                );
            }
        });
    }
};