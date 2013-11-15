(function($){
    $(document).ready(function(){
        //setup DB connection
        persistence.store.websql.config(persistence, "bitwork_ipadapp", 'bitwork iPadApp database', 5 * 1024 * 1024);
        //create DB schema
        persistence.schemaSync();

        //Sync with sharepoint
        NewsUtils.sharePointSync();
        CalendarUtils.sharePointSync();
        equipmentproductsUtils.sharePointSync();
        LinkUtils.sharePointSync();

        ProductGroupsUtils.sharePointSync();
        ProductFamiliesUtils.sharePointSync();
        ProductPlatformsUtils.sharePointSync();
        ProductsUtils.sharePointSync();
    });
})(jQuery)