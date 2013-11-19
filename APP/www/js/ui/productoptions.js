var productoptions_CONTAINER = "#productoptions-items-container",
    productoptions_ITEM_TEMPLATE = "#productoptions-item-template";

var productoptionsUI = {
    displayStammdaten: function () {
        var $container = $(productoptions_CONTAINER),
            $template = $(productoptions_ITEM_TEMPLATE);


        if ($container.length && $template.length) {
            //load options by current url parameter / andhand von aktueller ID laden
            var ProduktgruppePar = utils.getUrlParameter('Produktgruppe');
            var ProduktfamiliePar = utils.getUrlParameter('Produktfamilie');
            var ProduktplatformPar = utils.getUrlParameter('Produktplattform');
            var ProduktPar = utils.getUrlParameter('Produkt');
            var EquipmentProductPar = utils.getUrlParameter('EquipmentProdukt');
            var OtherProductPar = utils.getUrlParameter('SonstigesProdukt');

            //if its an equipment page the otherproduct is empty (or the other way around) -  this would cause problems in the SQL query - hence its set to -1)
            //TODO order by name

            if (!EquipmentProductPar) {
                EquipmentProductPar = "-1";
            }
            if (!OtherProductPar) {
                OtherProductPar = "-1";
            }
            //check wheter there is an option to either the current equipment / other product or one of its lower level items (group, family, platform, product)
            persistence.debug = true;
            ProductOptions.all()
                .filter("EquipmentFK", "=", EquipmentProductPar)
                .or(new persistence.PropertyFilter("productgroupFK", "=", ProduktgruppePar))
                .or(new persistence.PropertyFilter("productfamilyFK", "=", ProduktfamiliePar))
                .or(new persistence.PropertyFilter("productplatformFK", "=", ProduktplatformPar))
                .or(new persistence.PropertyFilter("productFK", "=", ProduktPar))
                .list(null, function (results) {
                    $.each(results, function (index, value) {

                        var data = value._data;
                        var $newItem = $template.clone();

                        $newItem.removeAttr('id');
                        $('.productoption-item-optionsbezeichnung', $newItem).html(data.productDescription);
                        $('.productoption-item-teilenummer', $newItem).html(data.pieceNumber);
                        $('.productoption-item-listenpreis', $newItem).html(data.price);

                        $container.append($newItem.removeClass('hidden'));
                    });
                });
        }
    }
};

//bind to sync ready event in order to display the news
$('body').on('productoptions-sync-ready', productoptionsUI.displayStammdaten);


