var CONTACTS_CONTAINER = "#contact-items-container",
    CONTACTS_PERSON_TEMPLATE = "#contacts-person-item-template",
    CONTACTS_FOLDER_TEMPLATE = "#contacts-folder-item-template",
    CONTACTS_DETAILS_TEMPLATE = "#contacts-details-template";

var ContactsUI = {

    displayContactTree : function(){
        var $container = $(CONTACTS_CONTAINER),
            $templatePerson = $(CONTACTS_PERSON_TEMPLATE),
            $templateFolder = $(CONTACTS_FOLDER_TEMPLATE);

        if($container.length && $templateFolder.length && $templatePerson.length){

            Contacts.all().filter("parentFolder", "=", 0).order('isFolder', false).order('name', true).list(null, function(results){

                $.each(results, function(index, value){
                    var data = value._data,
                        newItem;

                    if(data.isFolder){
                        newItem = $templateFolder.clone();
                    } else {
                        newItem = $templatePerson.clone();
                    }

                    newItem.removeAttr('id');

                    $('.tree-nav-item-name', newItem).html(data.name + " " + data.forename);
                    $('.tree-nav-link', newItem).attr("data-item-id", data.contactId);


                    $container.append(newItem.removeClass('hidden'));
                });
            });
        }
    },

    updateContactTree : function(container, nodeId){
        var $templatePerson = $(CONTACTS_PERSON_TEMPLATE),
            $templateFolder = $(CONTACTS_FOLDER_TEMPLATE);
        console.log(arguments);
        if(container.length && $templateFolder.length && $templatePerson.length){
            Contacts.all().filter("parentFolder", "=", parseInt(nodeId, 10)).order('isFolder', false).order('name', true).list(null, function(results){
                console.log(results);
                $.each(results, function(index, value){
                    var data = value._data,
                        newItem;

                    if(data.isFolder){
                        newItem = $templateFolder.clone();
                    } else {
                        newItem = $templatePerson.clone();
                    }

                    newItem.removeAttr('id');

                    $('.tree-nav-item-name', newItem).html(data.name + " " + data.forename);
                    $('.tree-nav-link', newItem).attr("data-item-id", data.contactId);


                    container.append(newItem.removeClass('hidden'));
                });
            });
        }
    },

    displayContactInfo : function(contactId){
        var $templateContactInfo = $(CONTACTS_DETAILS_TEMPLATE);

        if($templateContactInfo.length && contactId){
            Contacts.all().filter("contactId", "=", parseInt(contactId, 10)).list(null, function(results){
                var data = results[0]._data;

                $(".contact-details-name", $templateContactInfo).html(data.name + " " + data.forename);
                $(".contact-details-function", $templateContactInfo).html(data.jobFunction);
                $(".contact-details-department", $templateContactInfo).html(data.department);

                if(data.profilePicture) {
                    $(".contact-details-picture", $templateContactInfo).html(data.profilePicture);
                }

                if(data.phone) {
                    $(".contact-details-phone", $templateContactInfo).html(data.phone);
                    $(".contact-details-phone-container", $templateContactInfo).removeClass("hidden");
                } else {
                    $(".contact-details-phone-container", $templateContactInfo).addClass("hidden");
                }

                if(data.mobilePhone) {
                    $(".contact-details-mobile", $templateContactInfo).html(data.mobilePhone);
                    $(".contact-details-mobile-container", $templateContactInfo).removeClass("hidden");
                } else {
                    $(".contact-details-mobile-container", $templateContactInfo).addClass("hidden");
                }

                if(data.fax) {
                    $(".contact-details-fax", $templateContactInfo).html(data.fax);
                    $(".contact-details-fax-container", $templateContactInfo).removeClass("hidden");
                } else {
                    $(".contact-details-fax-container", $templateContactInfo).addClass("hidden");
                }

                if(data.email) {
                    $(".contact-details-email", $templateContactInfo).html(data.email).attr('href', 'mailto:' + data.email);
                    $(".contact-details-email-container", $templateContactInfo).removeClass("hidden");
                } else {
                    $(".contact-details-email-container", $templateContactInfo).addClass("hidden");
                }

                if(data.representative) {
                    $(".contact-details-representative", $templateContactInfo).html(data.representative);
                    $(".contact-details-representative-container", $templateContactInfo).removeClass("hidden");
                } else {
                    $(".contact-details-representative-container", $templateContactInfo).addClass("hidden");
                }

                if(data.description) {
                    $(".contact-details-description", $templateContactInfo).html(data.description).removeClass("hidden");
                    $("hr", $templateContactInfo).removeClass("hidden");
                } else {
                    $("hr", $templateContactInfo).addClass("hidden");
                    $(".contact-details-description", $templateContactInfo).html(" ").addClass("hidden");
                }

                $templateContactInfo.show(300);
            });
        }
    }
};

//bind to sync ready event in order to display the news
$('body').on('contacts-sync-ready', ContactsUI.displayContactTree);

$(document).ready(function(){

    $('body').on('click', '.tree-nav-link.folder', function(e){
        e.preventDefault();
        var $this = $(this),
            nodeId = $this.attr("data-item-id"),
            container = $this.siblings("ul.tree-nav"),
            $icon = $('.fa', $this);

        if(container.length && $('li', container).length === 0){
            ContactsUI.updateContactTree(container, nodeId);
        }

        $this.siblings("ul.tree-nav").toggle(300);
        $this.toggleClass("collapsed");

        if($icon.hasClass('fa-folder')){
            $icon.removeClass('fa-folder').addClass('fa-folder-open');
        } else {
            $icon.removeClass('fa-folder-open').addClass('fa-folder');
        }
    });

    $('body').on('click', '.tree-nav-link.person', function(e){
        e.preventDefault();

        var $this = $(this),
            contactId = $this.attr("data-item-id");

        if(!$this.hasClass('active-contact')){
            ContactsUI.displayContactInfo(contactId);
            $('.tree-nav-link.person.active-contact').removeClass('active-contact')
            $this.addClass('active-contact');
        }
    });

});