var CONTACTS_CONTAINER = "#contact-items-container",
    CONTACTS_PERSON_TEMPLATE = "#contacts-person-item-template",
    CONTACTS_FOLDER_TEMPLATE = "#contacts-folder-item-template",
    CONTACTS_DETAILS_TEMPLATE = "#contacts-details-template",
    CONTACTS_EMPTY_CONTAINER = "#contacts-empty-container",
    CONTACTS_ROOT_FOLDER = "Telefonbuch";

var ContactsUI = {

    resetContactTree: function () {
        var $container = $(CONTACTS_CONTAINER);
        $('li', $container).not(CONTACTS_FOLDER_TEMPLATE).not(CONTACTS_PERSON_TEMPLATE).remove();
    },

    displayContactTree: function () {
        var $container = $(CONTACTS_CONTAINER),
            $templatePerson = $(CONTACTS_PERSON_TEMPLATE),
            $templateFolder = $(CONTACTS_FOLDER_TEMPLATE);

        if ($container.length && $templateFolder.length && $templatePerson.length) {
            ContactsUI.resetContactTree();
            Contacts.all().filter("parentFolder", "=", CONTACTS_ROOT_FOLDER).order('isFolder', true).order('name', true).list(null, function (results) {
                if (results.length) {
                    $(CONTACTS_EMPTY_CONTAINER).addClass('hidden');
                    $.each(results, function (index, value) {
                        var data = value._data,
                            newItem;

                        if (data.isFolder) {
                            newItem = $templateFolder.clone();
                        } else {
                            newItem = $templatePerson.clone();
                        }

                        newItem.removeAttr('id');

                        $('.tree-nav-item-name', newItem).html(data.name + " " + data.forename);
                        $('.tree-nav-link', newItem).attr("data-item-id", data.contactId);
                        $('.tree-nav-link', newItem).attr("data-item-name", data.name);


                        $container.append(newItem.removeClass('hidden'));
                    });
                } else {
                    $(CONTACTS_EMPTY_CONTAINER).removeClass('hidden');
                }
            });
        }

        SyncModel.getSyncDate(CONTACTS_LIST, function (date) {
            //update last sync date
            $('.page-sync-btn-date').html(date);
            $('.page-sync-btn').removeClass('hidden');
        });
    },

    updateContactTree: function (container, nodeId) {
        var $templatePerson = $(CONTACTS_PERSON_TEMPLATE),
            $templateFolder = $(CONTACTS_FOLDER_TEMPLATE);

        if (container.length && $templateFolder.length && $templatePerson.length) {
            Contacts.all().filter("parentFolder", "=", nodeId).order('isFolder', false).order('name', true).list(null, function (results) {

                $.each(results, function (index, value) {
                    var data = value._data,
                        newItem;

                    if (data.isFolder) {
                        newItem = $templateFolder.clone();
                    } else {
                        newItem = $templatePerson.clone();
                    }

                    newItem.removeAttr('id');

                    $('.tree-nav-item-name', newItem).html(data.name + " " + data.forename);
                    $('.tree-nav-link', newItem).attr("data-item-id", data.contactId);
                    $('.tree-nav-link', newItem).attr("data-item-name", data.name);


                    container.append(newItem.removeClass('hidden'));
                });
            });
        }
    },

    displayContactInfo: function (contactId) {
        var $templateContactInfo = $(CONTACTS_DETAILS_TEMPLATE);

        if ($templateContactInfo.length && contactId) {
            Contacts.all().filter("contactId", "=", parseInt(contactId, 10)).list(null, function (results) {
                if (results.length) {
                    var data = results[0]._data;

                    $('a.contact-item-to-phone', $templateContactInfo).attr('data-contact-id', data.contactId);

                    $(".contact-details-name", $templateContactInfo).html(data.name + " " + data.forename);
                    $(".contact-details-function", $templateContactInfo).html(data.jobFunction);
                    $(".contact-details-department", $templateContactInfo).html(data.department);

                    if (data.profilePicture) {
                        $(".contact-details-picture", $templateContactInfo).attr('src', data.profilePicture);
                    } else {
                        $(".contact-details-picture", $templateContactInfo).attr('src', $(".contact-details-picture", $templateContactInfo).attr('data-default-image'));
                    }

                    if (data.phone) {
                        $(".contact-details-phone", $templateContactInfo).html(data.phone);
                        $(".contact-details-phone-container", $templateContactInfo).removeClass("hidden");
                    } else {
                        $(".contact-details-phone-container", $templateContactInfo).addClass("hidden");
                    }

                    if (data.mobilePhone) {
                        $(".contact-details-mobile", $templateContactInfo).html(data.mobilePhone);
                        $(".contact-details-mobile-container", $templateContactInfo).removeClass("hidden");
                    } else {
                        $(".contact-details-mobile-container", $templateContactInfo).addClass("hidden");
                    }

                    if (data.fax) {
                        $(".contact-details-fax", $templateContactInfo).html(data.fax);
                        $(".contact-details-fax-container", $templateContactInfo).removeClass("hidden");
                    } else {
                        $(".contact-details-fax-container", $templateContactInfo).addClass("hidden");
                    }

                    if (data.email) {
                        $(".contact-details-email", $templateContactInfo).html(data.email).attr('href', 'mailto:' + data.email);
                        $(".contact-details-email-container", $templateContactInfo).removeClass("hidden");
                    } else {
                        $(".contact-details-email-container", $templateContactInfo).addClass("hidden");
                    }

                    if (data.representative) {
                        $(".contact-details-representative", $templateContactInfo).html(data.representative);
                        $(".contact-details-representative-container", $templateContactInfo).removeClass("hidden");
                    } else {
                        $(".contact-details-representative-container", $templateContactInfo).addClass("hidden");
                    }

                    if (data.description) {
                        $(".contact-details-description", $templateContactInfo).html(data.description).removeClass("hidden");
                        $("hr:first", $templateContactInfo).removeClass("hidden");
                    } else {
                        $("hr:first", $templateContactInfo).addClass("hidden");
                        $(".contact-details-description", $templateContactInfo).html(" ").addClass("hidden");
                    }

                    $templateContactInfo.show(300);
                }
            });
        }


    }
};




(function ($) {


    $(document).ready(function () {
        //bind to sync ready event in order to display the news
        $('body').on('contacts-sync-ready db-schema-ready', function () {

            ContactsUI.displayContactTree();

            var requestParam = utils.getUrlParameter('contactID');
            if (requestParam !== "") {
                ContactsUI.displayContactInfo(parseInt(requestParam, 10));
            }
        });

        $('body').on('click', 'a.page-sync-btn', function () {
            ContactsModel.syncContacts();
        });

        //bind action to add calendar to phone button
        $('body').on('click', 'a.contact-item-to-phone', function (e) {
            e.preventDefault();
            var $this = $(this),
                contactid;

            contactid = $this.attr('data-contact-id');

            ContactsModel.addContactToPhone(contactid, function () {
                $this.addClass("disabled");
            });
        });

        $('body').on('click', '.tree-nav-link.folder', function (e) {
            e.preventDefault();
            var $this = $(this),
                nodeId = $this.attr("data-item-name"),
                container = $this.siblings("ul.tree-nav"),
                $icon = $('.fa', $this);

            if (container.length && $('li', container).length === 0) {
                ContactsUI.updateContactTree(container, nodeId);
            }

            $this.siblings("ul.tree-nav").toggle(300);
            $this.toggleClass("collapsed");

            if ($icon.hasClass('fa-folder')) {
                $icon.removeClass('fa-folder').addClass('fa-folder-open');
            } else {
                $icon.removeClass('fa-folder-open').addClass('fa-folder');
            }
        });

        $('body').on('click', '.tree-nav-link.person', function (e) {
            e.preventDefault();

            var $this = $(this),
                contactId = $this.attr("data-item-id");

            if (!$this.hasClass('active-contact')) {
                ContactsUI.displayContactInfo(contactId);
                $('.tree-nav-link.person.active-contact').removeClass('active-contact')
                $this.addClass('active-contact');
            }
        });

    });

})(jQuery);