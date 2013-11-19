var CONTACTS_SYNC_URL = "content/contacts.json";

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
    parentFolder: "INT"
});

Contacts.index('contactId', { unique: true });

var ContactsModel = {
    sharePointSync : function(callback){

        //TODO: replace with sharepoint connection
        $.getJSON(CONTACTS_SYNC_URL, function(data){
            $.each(data, function(index, value){
                var contactItem,
                    tmp = (value.profilePicture)? value.profilePicture.split('.') : false,
                    imageExtension = (tmp && tmp.length > 1)? (tmp[tmp.length - 1]).toLowerCase() : false;

                //save image date if exists
                if(imageExtension && (imageExtension === 'png' || imageExtension === 'jpg')){
                    var img = new Image();
                    img.src = value.profilePicture;
                    img.onload = function(){
                        value.profilePicture = utils.getBase64FromImage(img, imageExtension);
                        contactItem = new Contacts(value);
                        persistence.add(contactItem);
                    };
                } else {
                    value.profilePicture = "";
                    contactItem = new Contacts(value);
                    persistence.add(contactItem);
                }
            });

            persistence.flush(
                function(){
                    //DB is updated - trigger custom event
                    if(typeof callback === "function"){
                        callback();
                    }

                    $('body').trigger('contacts-sync-ready');
                }
            );
        }).fail(
            function(){
                //TODO: error handling if necessary
                alert("Contacts: Mock data read error.");

                if(typeof callback === "function") {
                    callback();
                }
            }
        );
    }
};