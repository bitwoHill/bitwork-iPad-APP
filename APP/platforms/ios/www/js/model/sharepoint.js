var Sync = persistence.define('Sync', {
    syncType: "TEXT",
    syncDate: "DATE",
    userId: "INT"
});

Sync.index('syncType', { unique: true });

SyncModel = {
    addSync : function(type){
        var syncItem = {
            syncType: (type)? type : "ALL",
            syncDate: new Date()
        };

        Sync.all().filter("syncType", "=", type).destroyAll(function(){
            persistence.add(new Sync(syncItem));
            persistence.flush();
        });
    },

    getSyncDate : function(type, callback){
        Sync.all().filter("syncType", "=", type).limit(1).list(function(res){
            var syncDate;
            //console.log(res[0]);
            if(res[0]._data.syncDate) {
                syncDate = utils.dateFormat(new Date(res[0]._data.syncDate), "m.d.y H:M");
                callback(syncDate);
            } else {
                callback(i18n.strings["na"]);
            }
        });
    }
};