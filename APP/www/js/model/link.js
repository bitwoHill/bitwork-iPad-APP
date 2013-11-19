var LINK_SYNC_URL = "content/links.json";

//DB model
var Link = persistence.define('Link', {
    linkId: "INT",
    label: "TEXT",
    linkUrl: "TEXT",
    description: "TEXT"
});

Link.index('linkId', { unique: true });

var LinkModel = {
    sharePointSync : function(callback){

        //TODO: replace with sharepoint connection
        $.getJSON(LINK_SYNC_URL, function(data){

            $.each(data, function(index, value){
                var linkItem = new Link(value);
                persistence.add(linkItem);
            });

            persistence.flush(
                function(){
                    //DB is updated - trigger custom event
                    if(typeof callback === "function"){
                        callback();
                    }

                    $('body').trigger('link-sync-ready');
                }
            );
        }).fail(
            function(){
                //TODO: error handling if necessary
                alert("Links: Mock data read error.");

                if(typeof callback === "function") {
                    callback();
                }
            }
        );
    }
};