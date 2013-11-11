(function($){

    $(document).ready(function(){
        //setup DB connection
        persistence.store.websql.config(persistence, "bitwork_ipadapp", 'database', 5 * 1024 * 1024);

        //create DB schema
        persistence.schemaSync();

        //example get news list JSON format and add to webSQL
        $.getJSON("/content/news.json", function(data){

            $.each(data, function(index, value){
                var newsItem = new News(value);
                persistence.add(newsItem);
            });

            persistence.flush(function(){
                //retrive all news items
                News.all().list(function(results){
                    console.log(results);
                })
            });
        });

    })

})(jQuery)