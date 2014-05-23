var CALENDAR_LIST = "Kalender";

//DB model
var Calendar = persistence.define('Calendar', {
    nodeId : "INT",
    title : "TEXT",
    body : "TEXT",
    bodySearch : "TEXT",
    image : "TEXT",
    location : "TEXT",
    startDate : "DATE",
    expirationDate : "DATE"
});

Calendar.index('nodeId', {
    unique : true
});
Calendar.textIndex('title');
Calendar.textIndex('bodySearch');

var CalendarModel = {

    syncCalendar : function() {
        $('body').trigger('sync-start');
        $('#msgCalendar').toggleClass('in');

        SharePoint.sharePointRequest(CALENDAR_LIST, CalendarModel.mapSharePointData);
    },

    mapSharePointData : function(data) {
        var spData = data.d;

        //wipe database of old entries
        Calendar.all().destroyAll(function(ele) {
            utils.emptySearchIndex("Calendar");

            if (spData && spData.results.length) {
                $.each(spData.results, function(index, value) {
                    var calendarContent = (value.Beschreibung) ? CalendarModel.formatBodyText(value.Beschreibung) : false, calendarItem = {
                        nodeId : value.ID,
                        title : value.Titel,
                        body : (calendarContent) ? calendarContent["bodyFormatted"] : "",
                        bodySearch : (calendarContent) ? calendarContent["bodyFormattedSearch"] : ""
                    };

                    if (value.Anfangszeit) {
                        calendarItem.startDate = utils.parseSharePointDate(value.Anfangszeit);
                    }

                    if (value.Endzeit) {
                        calendarItem.expirationDate = utils.parseSharePointDate(value.Endzeit);
                    }

                    if (value.Ort) {
                        calendarItem.location = value.Ort;
                    }

                    persistence.add(new Calendar(calendarItem));
                });

                persistence.flush(function() {
                    SyncModel.addSync(CALENDAR_LIST);
                    $('body').trigger('sync-end');
                    $('body').trigger('calendar-sync-ready');
                    $('#msgCalendar').removeClass('in');
                });
            }

        });

    },

    addCalendarToPhone : function(id, callback) {

        // do things if OK
        CalendarModel.getCalendarItem(id, function(calendarItem) {

            var startDate = calendarItem.startDate;
            var endDate = calendarItem.expirationDate;
            var title = calendarItem.title;
            var location = calendarItem.location;
            var notes = "";
            //calendarItem.body; //todo parse url
            var success = function(message) {
                console.log("Success: " + JSON.stringify(message));
                callback();
            };
            var error = function(message) {
                alert("Error: " + message);
            };

            //create the event
            if (confirm("Es wird das Ereignis '" + decodeURIComponent(title) + "' zum Kalender hinzugefügt")) {
                window.plugins.calendar.createEvent(title, location, notes, startDate, endDate, success, error);
            }

        });

    },

    getCalendarItem : function(id, callback) {
        Calendar.all().filter("nodeId", "=", parseInt(id, 10)).limit(1).list(function(res)
         {
            if (res.length && res[0]._data) {
                callback(res[0]._data);
            } else {
                callback(false);
            }
        });
    },

    formatBodyText : function(body) {

        var $body = $(body);
 //remove links
        try {
            $body.find('a').attr('target', "_system");
            var oldhref = $body.find('a').attr('href');
            var input = "/"
            //check if URL neeeds to be rewritten
            //add sharepoint domain to hyperlink. Atlas uses sharepoint functions to create hyperlinks. these are not comeplete for external users
            if (oldhref.substring(0, input.length) === input) // checks if URL starts with "/"
            {
                //if so, add http://www.atlas-cms.com/
                //    console.debug(oldhref);
                $body.find('a').attr('href', Settings.spContent + oldhref)
                var newhref = $body.find('a').attr('href');
                //  console.debug(newhref);
            }




        }
        catch (e)
        { }
        //remove links
        $body.find('a').remove();

        //remove images
        $body.find('img').remove();
//remove empty paragrafs
        $body.html($body.html().replace(/&nbsp;/g, ""));

 //remove &amp; paragrafs
        $body.html($body.html().replace(/&amp;/g, "&"));
 //replace curly brackets
        $body.html($body.html().replace(/{/g, "%7B"));
    $body.html($body.html().replace(/}/g, "%7D"));
        return {
            bodyFormatted : $body.html(),
            bodyFormattedSearch : $body.text()
        };
    },

    searchCalendar : function(key) {

        var calendarSearch = $.Deferred();
        key = "%" + key.replace("*", "") + "%";
        key = key.replace(/ /g, '%');
        //replace changes only first instance . thats why the global modifier "g" of a regular expression was used. find all whitepaces and change to %
                                    try {
                               if (!Calendar) {
            return calendarSearch.promise();
        }

        Calendar.all().filter("title", "LIKE", key).or(new persistence.PropertyFilter("bodySearch", "LIKE", key)).order("title", true, false).list(function(res) {
            calendarSearch.resolve(res);
        });
                                    } catch (e) {
                                    
                                        console.log(e);

                                    }
        
        // Calendar.search(key).list(function (res) {
        //       calendarSearch.resolve(res);
        //   });

        return calendarSearch.promise();
    }
};
