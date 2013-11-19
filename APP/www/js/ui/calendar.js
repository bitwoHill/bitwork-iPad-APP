var CALENDAR_CONTAINER = "#calendar-items-container",
    CALENDAR_ITEM_TEMPLATE = "#calendar-item-template";

var CalendarUI = {
    displayCalendar : function(){
        var $container = $(CALENDAR_CONTAINER),
            $template = $(CALENDAR_ITEM_TEMPLATE);

        if($container.length && $template.length){
            Calendar.all().list(null, function(results){
                $.each(results, function(index, value){
                    var data = value._data;
                    var $newItem = $template.clone();

                    $newItem.removeAttr('id');
                    //if(data.image) {
                    //    $('.box-content', $newItem).addClass('with-image');
                    //    $('.calendar-item-image', $newItem).attr('src', data.image);
                    //} else {
                    //    $('.calendar-item-image', $newItem).addClass('hidden');
                    //}
                    $('.calendar-item-title', $newItem).html(data.title);
                    $('.calendar-item-body', $newItem).html(data.body);

                    if(data.location) {
                        $('.calendar-item-location', $newItem).html(data.location);
                    } else {
                        $('.calendar-item-location-container', $newItem).addClass('hidden');
                    }

                    if(data.startDate) {
                        $('.calendar-item-date', $newItem).html(utils.dateFormat(new Date(data.startDate), "l, d F y, h:m"));
                    } else {
                        $('.calendar-item-date', $newItem).addClass('hidden');
                    }

                    $container.append($newItem.i18n().removeClass('hidden'));
                });
            });
        }
    }
};

//bind to sync ready event in order to display the calendar
$('body').on('calendar-sync-ready', CalendarUI.displayCalendar);