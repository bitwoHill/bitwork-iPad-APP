var INFOTHEK_LIST = "Infothek";

//DB model
var Infothek = persistence.define('Infothek', {
    nodeId: "INT",
    title: "TEXT",
    path: "TEXT",
    isFolder: "BOOL",
    parentFolder: "TEXT"
});

Infothek.index('nodeId', { unique: true });

var InfothekModel = {

    syncInfothek : function(){
        $('body').trigger('sync-start');

        SharePoint.sharePointRequest(INFOTHEK_LIST, InfothekModel.mapSharePointData);
    },

    mapSharePointData: function(data){
        console.log(data);
        var spData = data.d || false;

        if(spData && spData.results.length){
            $.each(spData.results, function(index, value){
                var newItem = {
                    nodeId : value.ID,
                    title : value.Name
                };

                newItem.isFolder = (value.Inhaltstyp === "Ordner")? true : false;

                if(value.Pfad){
                    var tmpPath = (value.Pfad).split("/").slice(1);
                    if(tmpPath.length){
                        newItem.parentFolder = tmpPath[tmpPath.length-1];
                    }
                }

                if(!newItem.isFolder){
                    newItem.path = Settings.spContent + value.Pfad + "/" + value.Name;

                    //TODO: replace with file upload
                    /*InfothekModel.downloadInfothekFile(newItem, index, spData.results.length, function(infothekItem, pos, length){
                        persistence.add(new Infothek(infothekItem));

                        persistence.flush(
                            function(){
                                if( pos+1 === length ){
                                    SyncModel.addSync(INFOTHEK_LIST);
                                    $('body').trigger('sync-end');
                                    $('body').trigger('infothek-sync-ready');
                                }
                            }
                        );
                    });*/
                }

                persistence.add(new Infothek(newItem));
            });

            persistence.flush(function(){
                SyncModel.addSync(INFOTHEK_LIST);
                $('body').trigger('sync-end');
                $('body').trigger('infothek-sync-ready');
            });

        }
    },

    downloadInfothekFile : function(infothekItem, index, length, callback){
        //TODO: use download mechanism to save file in device storage
        //Download mechanism should update infothekItem.path after upload.

        //after download done use callback
        callback(infothekItem, index, length);
    }
};