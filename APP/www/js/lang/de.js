var i18n = {

    langCode: "de",
    strings: {
        "months": ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
        "days": ["Son", "Mon", "Die", "Mit", "Don", "Fre", "Sam"],
        "na" : "N/A",

        //Login
        "login-label": "Anmelden",
        "login-auto": "Angemeldet bleiben",
        "login-page-title": "Am SharePoint anmelden",
        "login-error-username": "Benutzername muss eingetragen werden",
        "login-error-password": "Passwort muss eingetragen werden",
        "login-failed-msg": "Benutzername oder Passwort sind inkorrekt.",
        "db-reset": "Aufgrund von zuvielen falschen Loginversuchen wurden alle lokalen Anwendungsdaten gelöscht.",

        //Menu
        "menu-news": "News",
        "menu-calendar": "Kalender",
        "menu-contacts": "Telefonbuch",
        "menu-links": "Wichtige Links",
        "menu-mpl": "MPL",
        "menu-info": "Infothek",
        "menu-downloads": "Dokument Downloads",

        "last-sync": "Alle Daten synchronisieren <br>",
        "toggle-nav": "Navigation umschalten",
        "user-message": "Angemeldet als ",
        "login-different-user": "Als anderer Benutzer anmelden",

        "subtitle": "Herzlich willkommen auf dem Atlas Copco Portal",

        //Calendar
        "kalender": "Kalender",
        "last-sync-calendar": "Letzte Kalender Synchronisierung",
        "ort": "Ort",
        "anfangszeit": "Anfangszeit",
        "endzeit": "Endzeit",
        "calendar-add-phone": "Zum Telefonkalender hinzufügen",
        "empty-calendar": "Es wurden noch keine Kalendar-Events geladen. Benutzen Sie den <i class='fa fa-refresh'></i> Sync-Button um Kalendar-Events zu laden.",
        "add-calendar-entry": "Es wird ein Ereignis zum Kalender hinzugefügt",
        //News
        "news": "News",
        "last-sync-news": "Letzte News Synchronisierung",
        "weiterlesen": "Weiterlesen",
        "empty-news": "Es wurden noch keine News geladen. Benutzen Sie den <i class='fa fa-refresh'></i> Sync-Button um News zu laden.",

        //Links
        "wichtige-links": "Wichtige Links",
        "last-sync-links": "Letzte wichtige Links Synchronisierung",
        "empty-links": "Es wurden noch keine wichtige Links geladen. Benutzen Sie den <i class='fa fa-refresh'></i> Sync-Button um wichtige Links zu laden.",

        //MPL
        "stammdaten": "Stammdaten",
        "produktdetailinformationen": "Produktdetailinformationen",
        "produktbezeichnung": "Produktbezeichnung",
        "teilenummer": "Teilenummer",
        "listenpreis": "Listenpreis",
        "kuehlung": "Kuehlung",
        "austattungsvariante": "Austattungsvariante",
        "volumenstrom": "Volumenstrom",
        "druck": "Druck",
        "antriebsleistung": "Antriebsleistung",
        "empty-mpl": "Es wurden noch keine Optionen und Dokumente geladen. Benutzen Sie den <i class='fa fa-refresh'></i> Sync-Button um Optionen und Dokumente zu laden.  <br> <br> Wichtig: Produkt Dokumente können über die Schaltfläche 'Dokument Downloads' in der Menüleiste heruntergeladen werden.",
        "last-sync-mpl": "Letzte Stammdaten Synchronisierung",

        //MPL Documents
        "dokumente": "Dokumente",

        //MPL Optionen
        "option": "Option",
        "name": "Name",
        "optionsbezeichnung": "Optionen",

        //MPL Produtgruppen
        "produktgruppen": "Produktgruppen",
        "empty-produktgroups": "Es wurden noch keine Produktgruppen geladen. Benutzen Sie den <i class='fa fa-refresh'></i> Sync-Button um Produktgruppen zu laden.",
        "last-sync-productgroups": "Letzte Produktgruppen Synchronisierung",
        //MPL Produktfamilien
        "produktfamilien": "Produktfamilien",
        "empty-produktfamilies": "Es wurden noch keine Produktfamilien geladen. Benutzen Sie den <i class='fa fa-refresh'></i> Sync-Button um Produktfamilien zu laden.",
        "last-sync-productfamilies": "Letzte Produktfamilien Synchronisierung",
        //MPL Produktplattformen
        "produktplattformen": "Produktplattformen",
        "empty-productplatforms": "Es wurden noch keine Produktplattformen geladen. Benutzen Sie den <i class='fa fa-refresh'></i> Sync-Button um Produktplattformen zu laden.",
        "last-sync-productplatforms": "Letzte Produktplattform Synchronisierung",
        //MPL Produkt
        "produkt": "Produkt",
        "empty-products": "Es wurden noch keine Produkte geladen. Benutzen Sie den <i class='fa fa-refresh'></i> Sync-Button um Produkte zu laden.",
        "last-sync-products": "Letzte Produkt Synchronisierung",

        //InfoThek
        "infothek": "Infothek",
        "empty-infothek": "Es wurden noch keine Infothekdaten geladen. Benutzen Sie den <i class='fa fa-refresh'></i> Sync-Button um Infothekdaten zu laden. <br> <br> Wichtig: Infothek Dokumente können über die Schaltfläche 'Dokument Downloads' in der Menüleiste heruntergeladen werden.",
        "last-sync-infothek": "Letzte Infothek Synchronisierung",

        //Contacts
        "contacts": "Telefonbuch",
        "empty-contacts": "Es wurden noch keine Kontakte geladen. Benutzen Sie den <i class='fa fa-refresh'></i> Sync-Button um Kontakdaten zu laden.",
        "last-sync-contacts": "Letzte Kontaktdaten Synchronisierung",
        "contacts-add-phone": "zum Telefonbuch hinzufügen",

        //Downloads
        "downloads-title": "Downloads",
        "label-download": "Download",
        "label-close": "Close",
        "label-download-progress": "Download progress",
        "label-aboard-download": "Aboard download",
        "label-download-compleated": "Download completed",
        "label-download-success": "File(s) downloaded.",
        "label-download-fail": "File(s) not downloaded.",
        "prod-documents-sync": "Products documents sync",
        "prod-documents-sync-text": "This will synchronise products documents.",
        "infothek-documents-sync": "Infothek documents sync",
        "infothek-documents-sync-text": "This will synchronise infothek documents.",

        //Search
        "search-results": "Search results for: ",
        "search-input-error": "String must have at least 3 characters",
        "empty-news-search": "No news were found.",
        "empty-calendar-search": "No calendar entries were found.",
        "empty-contacts-search": "No contacts were found.",
        "empty-infothek-search": "No infothek items were found.",
        "empty-documents-search": "No documents were found.",
        "empty-mpl-search": "No MPL items were found."
    }
}