var CONTACTS_LIST = "Telefonbuch";

//DB model
var Contacts = persistence.define('Contacts', {
    contactId : "INT",
    name : "TEXT",
    forename : "TEXT",
    phone : "TEXT",
    mobilePhone : "TEXT",
    fax : "TEXT",
    email : "TEXT",
    department : "TEXT",
    jobFunction : "TEXT",
    profilePicture : "TEXT",
    description : "TEXT",
    representative : "TEXT",
    isFolder : "BOOL",
    parentFolder : "TEXT"
});

Contacts.index('contactId', {
    unique : true
});
//search indexed fields
Contacts.textIndex('name');
Contacts.textIndex('forename');
Contacts.textIndex('department');
Contacts.textIndex('jobFunction');
Contacts.textIndex('description');

var ContactsModel = {
    syncContacts : function() {
        $('body').trigger('sync-start');
        $('#msgContacts').toggleClass('in');

        SharePoint.sharePointRequest(CONTACTS_LIST, ContactsModel.mapSharePointData);
    },

    addNewsItemToDB : function(value, callback) {

        var newItem = {
            contactId : value.ID
        };

        newItem.name = (value.Name) ? value.Name : "";
        if (value.Nachname) {
            newItem.name = value.Nachname;
        }
        newItem.forename = (value.Vorname) ? value.Vorname : "";

        newItem.phone = (value.TelefonGeschäftlich) ? value.TelefonGeschäftlich : "";
        newItem.mobilePhone = (value.Mobiltelefonnummer) ? value.Mobiltelefonnummer : "";
        newItem.fax = (value.Faxnummer) ? value.Faxnummer : "";
        newItem.email = (value.EMail) ? value.EMail : "";

        newItem.jobFunction = (value.Funktion) ? value.Funktion : "";
        newItem.department = (value.Abteilung) ? value.Abteilung : "";

        newItem.description = (value.Beschreibung) ? value.Beschreibung : "";

        newItem.isFolder = (value.Inhaltstyp == "Bild") ? false : true;

        if (value.Pfad) {
            var tmpPath = (value.Pfad).split("/").slice(1);
            if (tmpPath.length) {
                newItem.parentFolder = tmpPath[tmpPath.length - 1];
            }
        }

        if (!newItem.isFolder) {
            var tmp = (value.Name) ? value.Name.split('.') : false, imageExtension = (tmp && tmp.length > 1) ? (tmp[tmp.length - 1]).toLowerCase() : false;

            if (imageExtension && (imageExtension === 'png' || imageExtension === 'jpg')) {

                //cancel if dummy pic
                if (value.Bildbreite !== 241 && value.Bildhöhe !== 160) {

                    var img = new Image();
                    img.src = Settings.spContent + value.Pfad + "/" + value.Name;
                    //console.log("ID: " + value.ID + " " + value.Bildbreite + " " + value.Bildhöhe);

                    img.onload = function() {
                        newItem.profilePicture = utils.getBase64FromImage(img, imageExtension);
                        persistence.add(new Contacts(newItem));

                        callback();

                    };
                    img.onerror = function() {
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
        } else {
            persistence.add(new Contacts(newItem));

            callback();
        }

    },

    //maps SharePoint data to current model
    mapSharePointData : function(data) {
        var spData = data.d;
        console.log("DataLength: " + spData.results.length);
        Contacts.all().destroyAll(function(ele) {
            console.log("Deleted Contacts list");
            utils.emptySearchIndex("Contacts");
            console.log("Deleted Contacts Search Index list");
            if (spData && spData.results.length) {
                var dataLength = spData.results.length, index = 0, addContactCallback = function() {
                    //  console.log("Index: " + index);
                    if (index === dataLength) {
                        index = 0;
                        console.log("Added all Contacts");

                        SyncModel.addSync(CONTACTS_LIST);
                        $('body').trigger('sync-end');
                        $('body').trigger('contacts-sync-ready');
                        $('#msgContacts').removeClass('in');

                        persistence.flush(function() {
                            console.log("finished Flush all Contacts");

                        });

                        return;
                    } else {
                        index++;
                        //flush persistence every fifth item. This is a workaround, as flushing all image files at once leads to a freeze on ios
                        if (index % 5 == 0) {
                            persistence.flush();
                        }

                        addNews(spData.results[index - 1]);
                    }
                }, addNews = function(contactItem) {
                    ContactsModel.addNewsItemToDB(contactItem, addContactCallback);
                };

                addContactCallback();
            }
        });
    },
    addContactToPhone : function(id, callback) {

        // do things if OK
        ContactsModel.getContactItem(id, function(contactItem) {

            var name = contactItem.name, forename = contactItem.forename, phone = contactItem.phone, mobilephone = contactItem.mobilePhone, fax = contactItem.fax, email = contactItem.email, department = contactItem.department, jobFunction = contactItem.jobFunction, description = contactItem.description, representative = contactItem.representative;

            var success = function(message) {
                console.log("Success: " + JSON.stringify(message));
                callback();
            };
            var error = function(message) {
                alert("Error: " + message);
            };

            //create the event
            if (confirm("Es wird der Kontakt " + name + " " + forename + " zum Telefonbuch hinzugefügt")) {
            

                var myContact = navigator.contacts.create();
                var contactname = new ContactName();
                contactname.familyName = name;
                contactname.givenName = forename;
                myContact.name = contactname;

                //Phonenumbers TODO check what happens if there no number
                var phoneNumbers = [];
                phoneNumbers[0] = new ContactField('Festnetz', phone, false);
                phoneNumbers[1] = new ContactField('Mobil', mobilephone, false);
                // preferred number
                phoneNumbers[2] = new ContactField('Fax', fax, false);

                myContact.phoneNumbers = phoneNumbers;
                //email
                var emails = [];
                emails[0] = new ContactField('E-Mail', email, false);
                myContact.emails = emails;

                myContact.note = "";
                if (department) {
                    myContact.note += "Abteilung: " + department + " ";
                }
                if (jobFunction) {
                    myContact.note += "Funktion: " + jobFunction + " ";
                }
                if (description) {
                    myContact.note += "Beschreibung: " + description + " ";
                }
                if (representative) {
                    myContact.note += "Vorgesetzter: " + representative + " ";
                }

                myContact.save(app.onContactSaveSuccess, app.onContactSaveError);

            }

        });

    },

    getContactItem : function(id, callback) {
        Contacts.all().filter("contactId", "=", parseInt(id, 10)).limit(1).list(function(res) {
            if (res.length && res[0]._data) {
                callback(res[0]._data);
            } else {
                callback(false);
            }
        });
    },

    searchContact : function(key) {
        var contactSearch = $.Deferred();
        Contacts.search(key).filter("isFolder", "=", false).list(function(res) {
            contactSearch.resolve(res);
        });

        return contactSearch.promise();
    }
};

