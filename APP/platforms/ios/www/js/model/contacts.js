var CONTACTS_LIST = "Telefonbuch";

//DB model
var Contacts = persistence.define('Contacts', {
    contactId: "INT",
    name: "TEXT",
    forename: "TEXT",
    phone: "TEXT",
    mobilePhone: "TEXT",
    fax: "TEXT",
    email: "TEXT",
    department: "TEXT",
    jobFunction: "TEXT",
    profilePicture: "TEXT",
    description: "TEXT",
    representative: "TEXT",
    isFolder: "BOOL",
    parentFolder: "TEXT"
});

Contacts.index('contactId', { unique: true });

var ContactsModel = {
    syncContacts : function(){
        $('body').trigger('sync-start');

        SharePoint.sharePointRequest(CONTACTS_LIST, ContactsModel.mapSharePointData);
    },

    addNewsItemToDB: function(value, callback){
        var newItem = {
            contactId : value.ID
        };

        newItem.name = (value.Name)? value.Name : "";
        if(value.Nachname) {
            newItem.name = value.Nachname;
        }
        newItem.forename = (value.Vorname)? value.Vorname : "";

        newItem.phone = (value.TelefonGeschäftlich)? value.TelefonGeschäftlich : "";
        newItem.mobilePhone = (value.Mobiltelefonnummer)? value.Mobiltelefonnummer : "";
        newItem.fax = (value.Faxnummer)? value.Faxnummer : "";
        newItem.email = (value.EMail)? value.EMail: "";

        newItem.jobFunction = (value.Funktion)? value.Funktion : "";
        newItem.department = (value.Abteilung)? value.Abteilung : "";

        newItem.description = (value.Beschreibung)? value.Beschreibung : "";

        newItem.isFolder = (value.Inhaltstyp == "Bild")? false : true;

        if(value.Pfad){
            var tmpPath = (value.Pfad).split("/").slice(1);
            if(tmpPath.length){
                newItem.parentFolder = tmpPath[tmpPath.length-1];
            }
        }

        if(!newItem.isFolder){
            var tmp = (value.Name)? value.Name.split('.') : false,
                imageExtension = (tmp && tmp.length > 1)? (tmp[tmp.length - 1]).toLowerCase() : false;

            if(imageExtension && (imageExtension === 'png' || imageExtension === 'jpg')){
                var img = new Image();
                img.src = Settings.spContent + value.Pfad + "/" + value.Name;
                img.onload = function(){
                    newItem.profilePicture = utils.getBase64FromImage(img, imageExtension);
                    persistence.add(new Contacts(newItem));
                    callback();
                };
                img.onerror = function(){
                    newItem.profilePicture = Settings.spContent + value.Pfad + "/" + value.Name;
                    persistence.add(new Contacts(newItem));
                    callback();
                };
            } else {
                persistence.add(new Contacts(newItem));
                callback();
            }
        } else {
            persistence.add(new Contacts(newItem));
            callback();
        }
    },

    //maps SharePoint data to current model
    mapSharePointData: function(data){
        var spData = data.d;

        if(spData && spData.results.length){
            var dataLength = spData.results.length,
                index = 0,
                addContactCallback = function(){

                    if(index === dataLength){
                        index = 0;
                        persistence.flush(
                            function(){
                                SyncModel.addSync(CONTACTS_LIST);
                                $('body').trigger('sync-end');
                                $('body').trigger('contacts-sync-ready');
                            }
                        );

                        return;
                    } else {
                        index++;
                        addNews(spData.results[index-1]);
                    }
                },
                addNews = function(contactItem){
                    ContactsModel.addNewsItemToDB(contactItem, addContactCallback)
                };

            addContactCallback();
        }
    }
};

