var Settings = {
        spDomain : "http://www.atlas-cms.com/_vti_bin/ListData.svc",
        spContent: "http://www.atlas-cms.com"
    },

    //To use this Proxy setting on your local machine you must define proxypass on your local http server.
    //e.g. Apache:
    // ProxyPass /SPbitwork/News http://www.atlas-cms.com/_vti_bin/ListData.svc/News
    // ProxyPassReverse /SPbitwork/News http://www.atlas-cms.com/_vti_bin/ListData.svc/News

    // ProxyPass /SPbitwork/ http://www.atlas-cms.com/_vti_bin/ListData.svc
    // ProxyPassReverse /SPbitwork/ http://www.atlas-cms.com/_vti_bin/ListData.svc
    proxySettings = {
        spDomain: "/SPbitwork"
        //spContent: "/SPbitworkContent"
    },
    mockSettings = {
        spDomain: "content/mockdata",
        spContent: "content"
    };

(function($){
    //custom settings will overwrite default settings on desktop browsers
    if(!("ontouchstart" in document.documentElement)){
        $.extend(Settings, proxySettings);
    }

    //To use mockdata please un-comment next line
    //$.extend(Settings, mockSettings);
})(jQuery);