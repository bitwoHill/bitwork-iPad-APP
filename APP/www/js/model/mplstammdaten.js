var MPL_STAMMDATEN_SYNC_URL = "content/mplstammdaten.json",
       MPL_STAMMDATEN_CONTAINER = "#products-items-container";

var MPLStammdatenUtils = {
    sharePointSync: function (callback) {

        //TODO: replace with sharepoint connection
        $.getJSON(MPL_STAMMDATEN_SYNC_URL, function (data) {

            $.each(data, function (index, value) {
                var mplstammdatenItem;

                mplstammdatenItem = new MPLStammdaten(value);
                persistence.add(mplstammdatenItem);
            });

            persistence.flush(
                function () {
                    //DB is updated - trigger custom event
                    if (typeof callback === "function") {
                        callback();
                    }

                    $('body').trigger('mplstammdaten-sync-ready');
                }
            );
        }).fail(
            function () {
                //TODO: error handling if necessary
                alert("MPL Stammdaten: Mock data read error.");

                if (typeof callback === "function") {
                    callback();
                }
            }
        );
    },

    displayStammdaten: function () {
        var $container = $(MPL_STAMMDATEN_CONTAINER);
        MPLStammdaten.all().list(null, function (results) {
            $.each(results, function (index, value) {

                if ($container.length) {
                
                var data = value._data;
                document.getElementById("valueProductDescription").innerHTML = data.productDescription;
                document.getElementById("valuePiecenumber").innerHTML = data.pieceNumber;
                document.getElementById("valuePrice").innerHTML = data.price;
                document.getElementById("valueCooling").innerHTML = data.cooling;
                document.getElementById("valueVariant").innerHTML = data.variant;
                document.getElementById("valueVolume").innerHTML = data.volume;
                document.getElementById("valuePressure").innerHTML = data.pressure;
                document.getElementById("valuePerformance").innerHTML = data.performance;
                }
            });
        });
    }
}
;

//bind to sync ready event in order to display the news
$('body').on('mplstammdaten-sync-ready', MPLStammdatenUtils.displayStammdaten);


