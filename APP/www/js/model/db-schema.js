var News = persistence.define('News', {
    nodeId: "INT",
    title: "TEXT",
    body: "TEXT",
    image: "TEXT",
    expirationDate: "DATE"
});

News.index('nodeId',{unique:true});

var Calendar = persistence.define('Calendar', {
    nodeId: "INT",
    title: "TEXT",
    body: "TEXT",
    image: "TEXT",
    location: "TEXT",
    startDate: "DATE",
    expirationDate: "DATE"
});

Calendar.index('nodeId',{unique:true});


var Link = persistence.define('Link', {
    linkId: "INT",
    label: "TEXT",
    linkUrl: "TEXT",
    description: "TEXT"
});

Link.index('linkId',{unique:true});