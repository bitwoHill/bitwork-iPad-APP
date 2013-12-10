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
Infothek.textIndex('title');

var InfothekModel = {

    syncInfothek : function(){
        $('body').trigger('sync-start');

        SharePoint.sharePointRequest(INFOTHEK_LIST, InfothekModel.mapSharePointData);
    },

    mapSharePointData: function(data){
    
        var spData = data.d || false;
        Infothek.all().destroyAll(function (ele) {
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
                    newItem.path = value.Pfad + "/" + value.Name;

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
        });
    },

    downloadSharePointFiles: function () {
        Infothek.all().limit(30).filter("isFolder", "=", false)
            .list(null, function (results) {
                if (results.length) {
                    var queueProgress = {
                        qLength: results.length,
                        qIndex: 0,
                        qSuccess: 0,
                        qFail: 0
                    }

                    $('body').trigger('download-queue-started', queueProgress);

                    $.each(results, function(index, value){
                        var data = value._data,
                            downloadData = {
                                folderName: "Infothek",
                                fileName: data.title,
                                path: data.path
                            };

                        $.downloadQueue(downloadData)
                            .done(
                            function(entrie){
                                queueProgress.qSuccess++;
                                results[index].path(entrie.fullPath);
                                //console.log("cnt:" + index);
                                persistence.flush();
                            }
                        ).fail(
                            function(entrie){
                                queueProgress.qFail++;
                                //console.log("cnt f:" + index);
                            }
                        ).always(
                            function(){
                                queueProgress.qIndex = index + 1;
                                if(queueProgress.qIndex === queueProgress.qLength){
                                    $('body').trigger('download-queue-ended', queueProgress);
                                } else {
                                    $('body').trigger('download-queue-progress', queueProgress);
                                }
                            }
                        );
                    });
                } else {
                    $('body').trigger('download-queue-ended', {
                        qLength: 1,
                        qIndex: 1,
                        qSuccess: 0,
                        qFail: 0
                    });
                }
            });
    },

    downloadInfothekFile : function(infothekItem, index, length, callback){
        //TODO: use download mechanism to save file in device storage
        //Download mechanism should update infothekItem.path after upload.

        //after download done use callback
        callback(infothekItem, index, length);
    },

    searchInfothek: function(key){
        var infothekSearch = $.Deferred();
        Infothek.search(key).list(function(res){
            infothekSearch.resolve(res);
        });

        return infothekSearch.promise();
    }
};