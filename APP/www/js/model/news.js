var News = persistence.define('News', {
    nodeId: "INT",
    title: "TEXT",
    text: "TEXT",
    image: "TEXT",
    expirationDate: "DATE"
});

News.index("nodeId");