var CALENDAR_SYNC_URL = "content/calendar.json";

//DB model
var Calendar = persistence.define('Calendar', {
    nodeId: "INT",
    title: "TEXT",
    body: "TEXT",
    image: "TEXT",
    location: "TEXT",
    startDate: "DATE",
    expirationDate: "DATE"
});

Calendar.index('nodeId', { unique: true });

var CalendarModel = {
    sharePointSync : function(callback){

        //TODO: replace with sharepoint connection
        var request = $.getJSON(CALENDAR_SYNC_URL, function(data){

            $.each(data, function(index, value){
                var calendarItem,
                    tmp = (value.image)? value.image.split('.') : false,
                    imageExtension = (tmp && tmp.length > 1)? (tmp[tmp.length - 1]).toLowerCase() : false;

                //save image date if exists
                if(imageExtension && (imageExtension === 'png' || imageExtension === 'jpg')){
                    var img = new Image();
                    img.src = value.image;
                    img.onload = function(){
                        value.image = utils.getBase64FromImage(img, imageExtension);
                        calendarItem = new Calendar(value);
                        persistence.add(calendarItem);
                    };
                } else {
                    value.image = "";
                    calendarItem = new Calendar(value);
                    persistence.add(calendarItem);
                }
            });

            persistence.flush(
                function(){
                    //DB is updated - trigger custom event
                    if(typeof callback === "function"){
                        callback();
                    }
                    $('body').trigger('calendar-sync-ready');
                }
            );
        }).fail(
            function(){
                //TODO: error handling if necessary
                console.log( "News: Mock data read error." );

                if(typeof callback === "function") {
                    callback();
                }
            }
        );
    }
};
