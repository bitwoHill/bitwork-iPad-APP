var CALENDAR_CONTAINER = "#calendar-items-container",
    CALENDAR_ITEM_TEMPLATE = "#calendar-item-template",
    CALENDAR_EMPTY_CONTAINER = "#calendar-empty-container";

var CalendarUI = {
    resetCalendar: function () {
        $(CALENDAR_CONTAINER + " > div").not(CALENDAR_EMPTY_CONTAINER).not(CALENDAR_ITEM_TEMPLATE).remove();
    },

    displayCalendar: function () {
        var $container = $(CALENDAR_CONTAINER),
            $template = $(CALENDAR_ITEM_TEMPLATE),
            requestParam = utils.getUrlParameter('calendarID');

        //show navigate backwardsbutton if site was opened from search (requestParam exists)
        if (requestParam !== "")
            $('#btnNavigateBackwardsSearch').removeClass('hidden');


        if ($container.length && $template.length) {
            CalendarUI.resetCalendar();

            var calendarList;
            if (requestParam == "") {
                calendarList = Calendar.all();

            }
            else {
                calendarList = Calendar.all().filter('nodeId', '=', parseInt(requestParam, 10));
            }

            calendarList.order('startDate', false).list(null, function (results) {
                if (results.length) {

                    $(CALENDAR_EMPTY_CONTAINER).addClass('hidden');
                    $.each(results, function (index, value) {
                        var data = value._data;
                        var $newItem = $template.clone();

                        $newItem.removeAttr('id');

                        $('.calendar-item-title', $newItem).html(data.title);
                        $('.calendar-item-body', $newItem).html(data.body);

                        $('a.calendar-item-to-phone', $newItem).attr('data-calendar-id', data.nodeId);




                        if (data.location) {
                            $('.calendar-item-location', $newItem).html(data.location);
                        } else {
                            $('.calendar-item-location-container', $newItem).addClass('hidden');
                        }

                        if (data.startDate) {
                            $('.calendar-item-startdate', $newItem).html(utils.dateFormat(new Date(data.startDate), "l, d F y, H:M"));
                        } else {
                            $('.calendar-item-startdate-container', $newItem).addClass('hidden');
                        }

                        if (data.expirationDate) {
                            $('.calendar-item-enddate', $newItem).html(utils.dateFormat(new Date(data.expirationDate), "l, d F y, H:M"));
                        } else {
                            $('.calendar-item-enddate-container', $newItem).addClass('hidden');
                        }

                        $container.append($newItem.i18n().removeClass('hidden'));
                    });
                } else {
                    $(CALENDAR_EMPTY_CONTAINER).removeClass('hidden');
                }
            });
        }

        SyncModel.getSyncDate("Kalender", function (date) {
            //update last sync date
            $('.page-sync-btn-date').html(date);
            $('.page-sync-btn').removeClass('hidden');
        });
    }
};

(function ($) {
    //Display calendar items when sync is ready
    $('body').on('calendar-sync-ready db-schema-ready', CalendarUI.displayCalendar);

    $(document).ready(function () {
        //Bind action to sync calendar button
        $('body').on('click', 'a.page-sync-btn', function (e) {
            e.preventDefault();
               var networkState = navigator.connection.type;
           if (networkState != Connection.NONE) {
            CalendarModel.syncCalendar();
        }
           else {
                alert("Sie sind nicht mit dem Internet verbunden. Der Vorgang wird abgebrochen.");
            }
        });

        //bind action to add calendar to phone button
        $('body').on('click', 'a.calendar-item-to-phone', function (e) {
            e.preventDefault();
            var $this = $(this),
                calendarId;

            calendarId = $this.attr('data-calendar-id');

            CalendarModel.addCalendarToPhone(calendarId, function () {
                $this.addClass("disabled");
            });
        });
    });

})(jQuery);
