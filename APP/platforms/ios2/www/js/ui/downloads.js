var DOWNLOADS_CONTAINER = "#downloads-container",
    DownloadsUI = {},
    DownloadModal;

(function ($) {

    DownloadsUI.doDownload = function (e) {
        e.preventDefault();
        var downloadType = $(this).attr("data-sync-type");
        //check connection type if not on wifi restrict user to use
        try {
            var networkState = navigator.connection.type;
            console.log("Networkstate: " + networkState);
            if (networkState == Connection.WIFI) {

                Sync.all().filter("syncType", "=", "Dokumente").limit(1).list(function (res) {
            try {
                var syncDate = new Date();
                syncDate.setDate(syncDate.getDate() - 99); // 99 Tage zurueck damit falls noch nicht gesynched wurde auch defintiiv gesynched wird
                var currentDate = new Date();
                var difference = 0;
                //console.log(res[0]);
                if (res.length && res[0]._data.syncDate) 
                    syncDate = new Date(res[0]._data.syncDate);
                    //abstand in tagen berechnen
                difference= Math.floor((currentDate - syncDate) / (1000*60*60*24));
                
                if (difference < 10)
                {
                     switch (downloadType) {
                    case "Infothek":
                        var loadAllWithDeleteAndDocuments = false;
                        InfothekModel.downloadSharePointFiles();
                        break;
                    case "Products":
                        documentsModel.downloadSharePointFiles();
                        break
                    default:
                        DownloadModal.hide();
                }
                }
                else
                {
                     switch (downloadType) {
                    case "Infothek":
                        var loadAllWithDeleteAndDocuments = true;
                        InfothekModel.syncInfothek(loadAllWithDeleteAndDocuments);
                        break;
                    case "Products":
                        documentsModel.sharePointDocuments();
                        break
                    default:
                        DownloadModal.hide();
                }
                }


            } catch (e) {
               
            }
        });

                DownloadModal.show();

               

            }
            else {
                alert("Die Dokumente sind mehrere Gigabyte groß und können nur bei einer WiFi (WLAN) Verbindung abgerufen werden");
            }

        }
        catch (e)
        { }


    }

    DownloadsUI.displayDownloads = function () {
        var $container = $(DOWNLOADS_CONTAINER);
        if ($container.length) {
            $container.removeClass("hidden");
        }
    };

    $.downloadModal = function (elem, options) {
        elem.modal(options);
        var progressBar = $('.progress-bar', elem),
            progressBarContainer = $('.progress', elem),
            downloadMessage = $('.download-modal-message', elem),
            closeBtn = $(".btn-close-modal");

        function show() {
            reset();
            initEventsHandlers();
            elem.modal("show");
        }

        function hide() {
            elem.modal("hide");
            reset();
        }

        function reset() {
            $('.close', elem).addClass('hidden');
            downloadMessage.addClass('hidden');
            progressBarContainer.addClass("progress-striped");
            //   closeBtn.attr("disabled", "disabled");
            updateProgressBar(0);
            destroyEventHandlers();
        }

        function updateProgressBar(value) {
            progressBar.attr("aria-valuenow", value).css('width', value + "%");
            $('span', progressBar).text(value + "%");
        }

        function downloadProgressHandler(event, data) {
            var progress = Math.floor((data.qIndex / data.qLength) * 100);
            updateProgressBar(progress);
        }

        function downloadReady(enent, data) {
            $('.badge-download-success', downloadMessage).text(data.qSuccess);
            $('.badge-download-fail', downloadMessage).text(data.qFail);
            downloadMessage.removeClass("hidden");
            progressBarContainer.removeClass("progress-striped");
            //   closeBtn.removeAttr("disabled");
        }

        function initEventsHandlers() {
            $('body').on('download-queue-progress download-queue-started', downloadProgressHandler);
            $('body').on('download-queue-ended', function (event, data) {
                downloadProgressHandler(event, data);
                downloadReady(event, data);
            });
            elem.on('hidden.bs.modal', reset)
        }

        function destroyEventHandlers() {
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

    $(document).ready(function () {

        DownloadModal = $.downloadModal($('#downloadModal'), {
            keyboard: false,
            backdrop: "static",
            show: false
        });
        $('body').on('click', '.sync-btn', DownloadsUI.doDownload);


    });

})(jQuery)