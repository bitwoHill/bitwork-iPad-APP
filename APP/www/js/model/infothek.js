var INFOTHEK_SYNC_URL = "content/infothek.json";

//DB model
var Infothek = persistence.define('Infothek', {
    nodeId: "INT",
    title: "TEXT",
    path: "TEXT",
    isFolder: "BOOL",
    parentFolder: "INT"
});

Infothek.index('nodeId', { unique: true });

var InfothekModel = {
    sharePointSync : function(callback){

        //TODO: replace with sharepoint connection
        $.getJSON(INFOTHEK_SYNC_URL, function(data){

            $.each(data, function(index, value){
                var newItem = new Infothek(value);

                persistence.add(newItem);
            });

            persistence.flush(
                function(){
                    //DB is updated - trigger custom event
                    if(typeof callback === "function"){
                        callback();
                    }

                    $('body').trigger('infothek-sync-ready');
                }
            );
        }).fail(
            function(){
                //TODO: error handling if necessary
                alert("Infothek: Mock data read error.");

                if(typeof callback === "function") {
                    callback();
                }
            }
        );
    }
};