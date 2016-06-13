var Settings = {
    spDomain: "https://www.atlas-cms.com/_vti_bin/ListData.svc",
    spContent: "https://www.atlas-cms.com",
    spListsWebservice: "https://www.atlas-cms.com/_vti_bin/Lists.asmx",
    spAuthentification: "https://www.atlas-cms.com/_vti_bin/authentication.asmx",
    loginExpiration: 1, //login cookie expiration [hours]
    loginExpirationExtended: 24, //login cookie expiration extended (automatic login) [hours]
    loginFailedAttempts: 7, //max number of login failed attempts
    loginFailedAttemptsExpiration: 24 * 30 //max number of login failed attempts in period [hours]
},

    //To use this Proxy setting on your local machine you must define proxypass on your local http server.
    //e.g. Apache:
    // ProxyPass /SPbitwork/News http://www.atlas-cms.com/_vti_bin/ListData.svc/News
    // ProxyPassReverse /SPbitwork/News http://www.atlas-cms.com/_vti_bin/ListData.svc/News

    // ProxyPass /SPbitwork/ http://www.atlas-cms.com/_vti_bin/ListData.svc
    // ProxyPassReverse /SPbitwork/ http://www.atlas-cms.com/_vti_bin/ListData.svc
    proxySettings = {
        spDomain: "/SPbitwork",
        spContent: "/SPbitworkContent",
        spListsWebservice: "/SPbitworkListsASMX"
    },
    mockSettings = {
        spDomain: "content/mockdata",
        spContent: "content"
    };

//(function ($) {
//    //custom settings will overwrite default settings on desktop browsers
//    if (!("ontouchstart" in document.documentElement)) {
//        $.extend(Settings, proxySettings);
//    }

//    //To use mockdata please un-comment next line
//    //$.extend(Settings, mockSettings);
//})(jQuery);