var CONTACTS_LIST = "Telefonbuch";

//Version 1
//var Contacts = persistence.define('Contacts', {
//    contactId : "INT",
//    name : "TEXT",
//    forename : "TEXT",
//    phone : "TEXT",
//    mobilePhone : "TEXT",
//    fax : "TEXT",
//    email : "TEXT",
//    department : "TEXT",
//    jobFunction : "TEXT",
//    profilePicture : "TEXT",
//    description : "TEXT",
//    representative : "TEXT",
//    isFolder : "BOOL",
//    parentFolder : "TEXT"
////});

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
    jobdescription: "TEXT",
    representative: "TEXT",
    isFolder: "BOOL",
    path: "TEXT",
    parentFolder: "TEXT",
    localModifiedDate: "DATE"
});

Contacts.index('contactId', {
    unique: true
});
//search indexed fields

Contacts.textIndex('name');
Contacts.textIndex('forename');
Contacts.textIndex('department');
Contacts.textIndex('jobFunction');
Contacts.textIndex('description');
Contacts.textIndex('jobdescription');

var ContactsModel = {
    syncContacts: function () {
        $('body').trigger('sync-start');
        $('#msgContacts').toggleClass('in');

        SharePoint.sharePointRequest(CONTACTS_LIST, ContactsModel.mapSharePointData);
    },


    addNewsItemToDB: function (spItem, callback) {


        Contacts.findBy("contactId", spItem.ID, function (dbItem) {
            if (typeof dbItem !== 'undefined' && dbItem != null) {
                //Found element


                if (dbItem.localModifiedDate()) { //skip

                    if (dbItem.localModifiedDate().getTime() == utils.parseSharePointDate(spItem.Geändert).getTime()) {
                        //console.log("skipped" + dbItem.contactId());
                        callback();
                    }
                    else {
                        //update
                        //     console.log("update");

                        dbItem.name((spItem.Name) ? spItem.Name : "");
                        if (spItem.Nachname) {
                            dbItem.name(spItem.Nachname);
                        }
                        dbItem.forename((spItem.Vorname) ? spItem.Vorname : "");

                        dbItem.phone((spItem.TelefonGeschäftlich) ? spItem.TelefonGeschäftlich : "");
                        dbItem.mobilePhone((spItem.Mobiltelefonnummer) ? spItem.Mobiltelefonnummer : "");
                        dbItem.fax((spItem.Faxnummer) ? spItem.Faxnummer : "");
                        dbItem.email((spItem.EMail) ? spItem.EMail : "");

                        dbItem.jobFunction((spItem.Funktion) ? spItem.Funktion : "");
                        dbItem.department((spItem.Abteilung) ? spItem.Abteilung : "");

                        dbItem.description((spItem.Beschreibung) ? spItem.Beschreibung : "");
                        dbItem.jobdescription((spItem.Stellenbeschreibung) ? spItem.Stellenbeschreibung : "");

                        dbItem.isFolder((spItem.Inhaltstyp == "Bild") ? false : true);


                        dbItem.localModifiedDate(utils.parseSharePointDate(spItem.Geändert));
                        if (spItem.Pfad) {
                            //use fullpath instead of only name
                            dbItem.parentFolder(spItem.Pfad);
                            dbItem.path(spItem.Pfad + "/" + spItem.Name);
                        }

                        if (!dbItem.isFolder()) {
                            var tmp = (spItem.Name) ? spItem.Name.split('.') : false, imageExtension = (tmp && tmp.length > 1) ? (tmp[tmp.length - 1]).toLowerCase() : false;

                            if (imageExtension && (imageExtension === 'png' || imageExtension === 'jpg')) {

                                //cancel if dummy pic
                                if (spItem.Bildbreite !== 241 && spItem.Bildhöhe !== 160) {

                                    var img = new Image();
                                    img.src = Settings.spDownloadURL + spItem.Pfad + "/" + spItem.Name;
                                    //console.log("ID: " + spItem.ID + " " + spItem.Bildbreite + " " + spItem.Bildhöhe);

                                    img.onload = function () {
                                        dbItem.profilePicture(utils.getBase64FromImage(img, imageExtension));

                                        callback();

                                    };
                                    img.onerror = function () {
                                        dbItem.profilePicture(Settings.spDownloadURL + spItem.Pfad + "/" + spItem.Name);

                                        callback();
                                    };
                                } else {

                                    callback();
                                }
                            } else {

                                callback();
                            }
                        } else {

                            callback();
                        }

                    }
                }
                else {
                    //update
                    //  console.log("update");

                    dbItem.name((spItem.Name) ? spItem.Name : "");
                    if (spItem.Nachname) {
                        dbItem.name(spItem.Nachname);
                    }
                    dbItem.forename((spItem.Vorname) ? spItem.Vorname : "");

                    dbItem.phone((spItem.TelefonGeschäftlich) ? spItem.TelefonGeschäftlich : "");
                    dbItem.mobilePhone((spItem.Mobiltelefonnummer) ? spItem.Mobiltelefonnummer : "");
                    dbItem.fax((spItem.Faxnummer) ? spItem.Faxnummer : "");
                    dbItem.email((spItem.EMail) ? spItem.EMail : "");

                    dbItem.jobFunction((spItem.Funktion) ? spItem.Funktion : "");
                    dbItem.department((spItem.Abteilung) ? spItem.Abteilung : "");

                    dbItem.description((spItem.Beschreibung) ? spItem.Beschreibung : "");
                    dbItem.jobdescription((spItem.Stellenbeschreibung) ? spItem.Stellenbeschreibung : "");

                    dbItem.isFolder((spItem.Inhaltstyp == "Bild") ? false : true);


                    dbItem.localModifiedDate(utils.parseSharePointDate(spItem.Geändert));
                    if (spItem.Pfad) {
                        //use fullpath instead of only name
                        dbItem.parentFolder(spItem.Pfad);
                        dbItem.path(spItem.Pfad + "/" + spItem.Name);
                    }

                    if (!dbItem.isFolder()) {
                        var tmp = (spItem.Name) ? spItem.Name.split('.') : false, imageExtension = (tmp && tmp.length > 1) ? (tmp[tmp.length - 1]).toLowerCase() : false;

                        if (imageExtension && (imageExtension === 'png' || imageExtension === 'jpg')) {

                            //cancel if dummy pic
                            if (spItem.Bildbreite !== 241 && spItem.Bildhöhe !== 160) {

                                var img = new Image();
                                img.src = Settings.spDownloadURL + spItem.Pfad + "/" + spItem.Name;
                                //console.log("ID: " + spItem.ID + " " + spItem.Bildbreite + " " + spItem.Bildhöhe);

                                img.onload = function () {
                                    dbItem.profilePicture(utils.getBase64FromImage(img, imageExtension));

                                    callback();

                                };
                                img.onerror = function () {
                                    dbItem.profilePicture(Settings.spDownloadURL + spItem.Pfad + "/" + spItem.Name);

                                    callback();
                                };
                            } else {

                                callback();
                            }
                        } else {

                            callback();
                        }
                    } else {

                        callback();
                    }


                }

            }
            else { //insert
                // console.log("insert");
                var newItem = {
                    contactId: spItem.ID
                };


                newItem.name = (spItem.Name) ? spItem.Name : "";
                if (spItem.Nachname) {
                    newItem.name = spItem.Nachname;
                }
                newItem.forename = (spItem.Vorname) ? spItem.Vorname : "";

                newItem.phone = (spItem.TelefonGeschäftlich) ? spItem.TelefonGeschäftlich : "";
                newItem.mobilePhone = (spItem.Mobiltelefonnummer) ? spItem.Mobiltelefonnummer : "";
                newItem.fax = (spItem.Faxnummer) ? spItem.Faxnummer : "";
                newItem.email = (spItem.EMail) ? spItem.EMail : "";

                newItem.jobFunction = (spItem.Funktion) ? spItem.Funktion : "";
                newItem.department = (spItem.Abteilung) ? spItem.Abteilung : "";

                newItem.description = (spItem.Beschreibung) ? spItem.Beschreibung : "";
                newItem.jobdescription = (spItem.Stellenbeschreibung) ? spItem.Stellenbeschreibung : "";

                newItem.isFolder = (spItem.Inhaltstyp == "Bild") ? false : true;


                newItem.localModifiedDate = utils.parseSharePointDate(spItem.Geändert);
                if (spItem.Pfad) {
                    //use fullpath instead of only name
                    newItem.parentFolder = spItem.Pfad;


                    newItem.path = spItem.Pfad + "/" + spItem.Name;

                }



                if (!newItem.isFolder) {
                    var tmp = (spItem.Name) ? spItem.Name.split('.') : false, imageExtension = (tmp && tmp.length > 1) ? (tmp[tmp.length - 1]).toLowerCase() : false;

                    if (imageExtension && (imageExtension === 'png' || imageExtension === 'jpg')) {

                        //cancel if dummy pic
                        if (spItem.Bildbreite !== 241 && spItem.Bildhöhe !== 160) {

                            var img = new Image();
                            img.src = Settings.spDownloadURL + spItem.Pfad + "/" + spItem.Name;
                            //console.log("ID: " + spItem.ID + " " + spItem.Bildbreite + " " + spItem.Bildhöhe);

                            img.onload = function () {
                                newItem.profilePicture = utils.getBase64FromImage(img, imageExtension);
                                persistence.add(new Contacts(newItem));

                                callback();

                            };
                            img.onerror = function () {
                                newItem.profilePicture = Settings.spDownloadURL + spItem.Pfad + "/" + spItem.Name;
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

            }

        });




    },

    //maps SharePoint data to current model
    mapSharePointData: function (data) {
        //create lookup Array with all SP Items stored by ID. This is used to compare the Local Document IDs to those on Sharepoint
        var lookupIDsSharePoint = {};
        var spData = data.d;
        console.log("DataLength: " + spData.results.length);
        // Contacts.all().destroyAll(function(ele) {
        //     console.log("Deleted Contacts list");
        //utils.emptySearchIndex("Contacts");
        console.log("Deleted Contacts Search Index list");
        if (spData && spData.results.length) {


            var dataLength = spData.results.length, index = 0, addContactCallback = function () {
                //  console.log("Index: " + index);
                if (index === dataLength) {
                    index = 0;
                    console.log("Added all Contacts");

                    SyncModel.addSync(CONTACTS_LIST);
                    $('body').trigger('sync-end');
                    $('body').trigger('contacts-sync-ready');
                    $('#msgContacts').removeClass('in');


                    //cleanup
                    Contacts.all().each(null, function (dbItem) {
                        //check if ID still exists on SharePoint
                        if (!lookupIDsSharePoint[dbItem.contactId()]) {
                            console.debug("lokales element wurde nicht mehr gefunden: ");
                            console.debug(dbItem.contactId());

                            // remove entity from persistence layer
                            persistence.remove(dbItem);
                        }
                    });

                    persistence.flush(function () {
                        console.log("finished Flush all Contacts");

                    });

                    return;
                } else {
                    index++;
                    lookupIDsSharePoint[spData.results[index - 1].ID] = spData.results[index - 1];

                    //flush persistence every fifth item. This is a workaround, as flushing all image files at once leads to a freeze on ios
                    if (index % 5 == 0) {
                        persistence.flush();
                    }

                    addNews(spData.results[index - 1]);
                }
            }, addNews = function (contactItem) {
                ContactsModel.addNewsItemToDB(contactItem, addContactCallback);
            };

            addContactCallback();
        }
        //  });
    },
    addContactToPhone: function (id, callback) {

        // do things if OK
        ContactsModel.getContactItem(id, function (contactItem) {

            var name = contactItem.name, forename = contactItem.forename, phone = contactItem.phone, mobilephone = contactItem.mobilePhone, fax = contactItem.fax, email = contactItem.email, department = contactItem.department, jobFunction = contactItem.jobFunction, description = contactItem.description, representative = contactItem.representative;

            var success = function (message) {
                console.log("Success: " + JSON.stringify(message));
                callback();
            };
            var error = function (message) {
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

    getContactItem: function (id, callback) {
        Contacts.all().filter("contactId", "=", parseInt(id, 10)).limit(1).list(function (res) {
            if (res.length && res[0]._data) {
                callback(res[0]._data);
            } else {
                callback(false);
            }
        });
    },

    searchContact: function (key) {
        var contactSearch = $.Deferred();
        Contacts.search(key).filter("isFolder", "=", false).list(function (res) {
            contactSearch.resolve(res);
        });

        return contactSearch.promise();
    }
};

