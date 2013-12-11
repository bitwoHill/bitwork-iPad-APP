var DOWNLOADS_CONTAINER = "#downloads-container",
    DownloadsUI = {},
    DownloadModal;

(function($)
{

    DownloadsUI.doDownload = function(e)
    {
        e.preventDefault();
        var downloadType = $(this).attr("data-sync-type");
//check connection type if not on wifi restrict user to use
try
{
var networkState = navigator.connection.type;
if (Connection.WIFI)
{
    DownloadModal.show();

        switch(downloadType){
            case "Infothek":
                InfothekModel.downloadSharePointFiles();
                break;
            case "Products":
                documentsModel.downloadSharePointFiles();
                break
            default :
                DownloadModal.hide();
        }

}
else
{
alert("Die Dokumente sind mehrere Gigabyte groß und können nur bei einer WiFi (WLAN) Verbindung abgerufen werden");
}

}
catch (e)
{}
    

    }

    DownloadsUI.displayDownloads = function(){
        var $container = $(DOWNLOADS_CONTAINER);
        if($container.length){
            $container.removeClass("hidden");
        }
    };

    $.downloadModal = function(elem, options){
        elem.modal(options);
        var progressBar = $('.progress-bar', elem),
            progressBarContainer = $('.progress', elem),
            downloadMessage = $('.download-modal-message', elem),
            closeBtn = $(".btn-close-modal");

        function show(){
            reset();
            initEventsHandlers();
            elem.modal("show");
        }

        function hide(){
            elem.modal("hide");
            reset();
        }

        function reset(){
            $('.close', elem).addClass('hidden');
            downloadMessage.addClass('hidden');
            progressBarContainer.addClass("progress-striped");
            closeBtn.attr("disabled", "disabled");
            updateProgressBar(0);
            destroyEventHandlers();
        }

        function updateProgressBar(value){
            progressBar.attr("aria-valuenow", value).css('width', value + "%");
            $('span', progressBar).text(value + "%");
        }

        function downloadProgressHandler(event, data){
            var progress = Math.floor( (data.qIndex / data.qLength ) * 100);
            updateProgressBar(progress);
        }

        function downloadReady(enent, data){
            $('.badge-download-success', downloadMessage).text(data.qSuccess);
            $('.badge-download-fail', downloadMessage).text(data.qFail);
            downloadMessage.removeClass("hidden");
            progressBarContainer.removeClass("progress-striped");
            closeBtn.removeAttr("disabled");
        }

        function initEventsHandlers(){
            $('body').on('download-queue-progress download-queue-started', downloadProgressHandler);
            $('body').on('download-queue-ended', function(event, data){
                downloadProgressHandler(event, data);
                downloadReady(event, data);
            });
            elem.on('hidden.bs.modal', reset)
        }

        function destroyEventHandlers(){
            $('body').off('download-queue-progress', downloadProgressHandler);
            $('body').off('download-queue-ended');
            elem.off('hidden.bs.modal', reset)
        }

        return {
            show: show,
            hide: hide
        };
    };

    $('body').on('db-schema-ready', DownloadsUI.displayDownloads);

    $(document).ready(function(){

        DownloadModal = $.downloadModal($('#downloadModal'), {
            keyboard: false,
            backdrop: "static",
            show: false
        });
        $('body').on('click', '.sync-btn', DownloadsUI.doDownload);

        ////Sync on demand
        //$('body').on('click', '.sync-btn-metadata', function () {
        //    $('body').removeClass('side-menu-active');
        //    sharePointSync();
        //});

    })

    //var sharePointSync = function () {
    //    var syncQueue = $({});

    //    //Add news sync to queue
    //    syncQueue.queue("sync-queue", function (next) {
    //        //bind event
    //        $('body').on('news-sync-ready sync-error', function () {
    //            next();
    //            //unbind event
    //            $('body').off('news-sync-ready sync-error', next);
    //        });
    //        NewsModel.syncNews();
    //    });

    //    //Add calendar sync to queue
    //    syncQueue.queue("sync-queue", function (next) {
    //        //bind event
    //        $('body').on('calendar-sync-ready sync-error', function () {
    //            //unbind event
    //            $('body').off('calendar-sync-ready sync-error', next);
    //            next();
    //        });
    //        CalendarModel.syncCalendar();
    //    });

    //    //Add Link sync to queue
    //    syncQueue.queue("sync-queue", function (next) {
    //        //bind event
    //        $('body').on('link-sync-ready sync-error', function () {
    //            //unbind event
    //            $('body').off('link-sync-ready sync-error', next);
    //            next();
    //        });
    //        LinkModel.syncLinks();
    //    });

    //    //Add contacts sync to queue
    //    syncQueue.queue("sync-queue", function (next) {
    //        //bind event
    //        $('body').on('contacts-sync-ready sync-error', function () {
    //            //unbind event
    //            $('body').off('contacts-sync-ready sync-error', next);
    //            next();
    //        });
    //        ContactsModel.syncContacts();
    //    });

    //    syncQueue.queue("sync-queue", function (next) {
    //        //bind event
    //        $('body').on('productgroups-sync-ready sync-error', function () {
    //            //unbind event
    //            $('body').off('productgroups-sync-ready sync-error', next);
    //            next();
    //        });
    //        ProductGroupsModel.syncProductGroups();
    //    });

    //    syncQueue.queue("sync-queue", function (next) {
    //        //bind event
    //        $('body').on('productfamilies-sync-ready sync-error', function () {
    //            //unbind event
    //            $('body').off('productfamilies-sync-ready sync-error', next);
    //            next();
    //        });
    //        ProductFamiliesModel.sharePointFamilies();
    //    });

    //    syncQueue.queue("sync-queue", function (next) {
    //        //bind event
    //        $('body').on('productplatforms-sync-ready sync-error', function () {
    //            //unbind event
    //            $('body').off('productplatforms-sync-ready sync-error', next);
    //            next();
    //        });
    //        ProductPlatformsModel.sharePointPlatforms();
    //    });

    //    syncQueue.queue("sync-queue", function (next) {
    //        //bind event
    //        $('body').on('products-sync-ready sync-error', function () {
    //            //unbind event
    //            $('body').off('products-sync-ready sync-error', next);
    //            next();
    //        });
    //        ProductsModel.sharePointProducts();
    //    });

    //    syncQueue.queue("sync-queue", function (next) {
    //        //bind event
    //        $('body').on('otherproducts-sync-ready sync-error', function () {
    //            //unbind event
    //            $('body').off('otherproducts-sync-ready sync-error', next);
    //            next();
    //        });
    //        otherproductsModel.sharePointOtherproducts();
    //    });

    //    syncQueue.queue("sync-queue", function (next) {
    //        //bind event
    //        $('body').on('equipmentproducts-sync-ready sync-error', function () {
    //            //unbind event
    //            $('body').off('equipmentproducts-sync-ready sync-error', next);
    //            next();
    //        });
    //        equipmentproductsModel.sharePointEquipmentproducts();
    //    });

    //    syncQueue.queue("sync-queue", function (next) {
    //        //bind event
    //        $('body').on('productoptions-sync-ready sync-error', function () {
    //            //unbind event
    //            $('body').off('productoptions-sync-ready sync-error', next);
    //            next();
    //        });
    //        productoptionsModel.sharePointProductOptions();
    //    });


    //    syncQueue.queue("sync-queue", function (next) {
    //        //bind event
    //        $('body').on('documents-sync-ready sync-error', function () {
    //            //unbind event
    //            $('body').off('documents-sync-ready sync-error', next);
    //            next();
    //        });
    //        documentsModel.sharePointDocuments();
    //    });

    //    syncQueue.queue("sync-queue", function (next) {
    //        //bind event
    //        $('body').on('infothek-sync-ready sync-error', function () {
    //            //unbind event
    //            $('body').off('infothek-sync-ready sync-error', next);
    //            next();
    //        });
    //        InfothekModel.syncInfothek();
    //    });


    //    syncQueue.dequeue("sync-queue");
    //}

})(jQuery)