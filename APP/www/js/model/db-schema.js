var News = persistence.define('News', {
    nodeId: "INT",
    title: "TEXT",
    body: "TEXT",
    image: "TEXT",
    expirationDate: "DATE"
});

News.index('nodeId', { unique: true });

var Calendar = persistence.define('Calendar', {
    nodeId: "INT",
    title: "TEXT",
    body: "TEXT",
    image: "TEXT",
    location: "TEXT",
    startDate: "DATE",
    expirationDate: "DATE"
});

Calendar.index('nodeId', { unique: true });


var Link = persistence.define('Link', {
    linkId: "INT",
    label: "TEXT",
    linkUrl: "TEXT",
    description: "TEXT"
});

Link.index('linkId', { unique: true });

//mpl
var Productgroups = persistence.define('Productgroups', {
    productgroupid: "INT",
    productgroup: "TEXT"
});

Productgroups.index('productgroupid', { unique: true });


var Productfamilies = persistence.define('Productfamilies', {
    productfamilyid: "INT",
    productfamily: "TEXT",
    productgroupFK: "INT"
});

Productfamilies.index('productfamilyid', { unique: true });


var Productplatforms = persistence.define('Productplatforms', {
    productplatformid: "INT",
    productplatform: "TEXT",
    productfamilyFK: "INT"
});

Productplatforms.index('productplatformid', { unique: true });


var Products = persistence.define('Products', {
    productid: "INT",
    product: "TEXT",
    productplatformFK: "INT"
});

Products.index('productid', { unique: true });


var EquipmentProducts = persistence.define('EquipmentProducts', {
    equipmentId: "INT",
    productDescription: "TEXT",
    pieceNumber: "TEXT",
    price: "TEXT",
    cooling: "TEXT",
    variant: "TEXT",
    volume: "TEXT",
    pressure: "TEXT",
    performance: "TEXT",
    productFK: "INT"
});

EquipmentProducts.index(['equipmentId', 'piecenumber'], { unique: true });


var OtherProducts = persistence.define('OtherProducts', {
    otherProductId: "INT",
    productDescription: "TEXT",
    pieceNumber: "TEXT",
    price: "TEXT",
    productFK: "INT"
});

OtherProducts.index(['otherProductId', 'piecenumber'], { unique: true });

var ProductOptions = persistence.define('ProductOptions', {
    productOptionId: "INT",
    productDescription: "TEXT",
    pieceNumber: "TEXT",
    price: "TEXT",
    productgroupFK: "INT",
    productfamilyFK: "INT",
    productplatformFK: "INT",
    productFK: "INT",
    EquipmentFK: "INT"
});

ProductOptions.index(['productOptionId', 'piecenumber'], { unique: true });


//in this case the foreignkeys are Text, because there can be a relation to several items
var Documents = persistence.define('Documents', {
    documentId: "INT",
    documentname: "TEXT",
    documenttypeFK: "INT",
    path: "TEXT",
    productgroupFK: "TEXT",
    productfamilyFK: "TEXT",
    productplatformFK: "TEXT",
    productFK: "TEXT",
    EquipmentFK: "TEXT"
});

Documents.index(['documentId'], { unique: true });


//Documenttypes
var Documenttypes = persistence.define('Documenttypes', {
    documenttypeId: "INT",
    name: "TEXT",
});

Documenttypes.index(['documenttypeId'], { unique: true });

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