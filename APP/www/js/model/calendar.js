var CALENDAR_LIST = "Kalender";

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

    syncCalendar : function(){
        $('body').trigger('sync-start');

        SharePoint.sharePointRequest(CALENDAR_LIST, CalendarModel.mapSharePointData);
    },

    mapSharePointData : function(data){
        var spData = data.d;
        console.log(spData);
        if(spData && spData.results.length){
            $.each(spData.results, function(index, value){
                var calendarItem = {
                    nodeId : value.ID,
                    title : value.Titel,
                    body : CalendarModel.formatBodyText(value.Beschreibung)
                };

                if(value.Anfangszeit) {
                    calendarItem.startDate = utils.parseSharePointDate(value.Anfangszeit);
                }

                if(value.Endzeit) {
                    calendarItem.expirationDate = utils.parseSharePointDate(value.Endzeit);
                }

                if(value.Ort) {
                    calendarItem.location = value.Ort;
                }

                persistence.add(new Calendar(calendarItem));
            });

            persistence.flush(
                function(){
                    SyncModel.addSync(CALENDAR_LIST);
                    $('body').trigger('sync-end');
                    $('body').trigger('calendar-sync-ready');
                }
            );
        }
    },

    addCalendarToPhone: function(id, callback){
        CalendarModel.getCalendarItem(id, function(calendarItem){
            console.log(calendarItem);

            //TODO: use pgone gap function to sync calendar data
            callback();
        });
    },

    getCalendarItem: function(id, callback){
        Calendar.all().filter("nodeId", "=", parseInt(id, 10)).limit(1).list(function(res){
            if(res.length && res[0]._data) {
                callback(res[0]._data);
            } else {
                callback(false);
            }
        })
    },

    formatBodyText : function(body){

        var $body = $(body);

        //remove links
        $body.find('a').remove();

        //remove images
        $body.find('img').remove();

        return $body.html();
    }
};
