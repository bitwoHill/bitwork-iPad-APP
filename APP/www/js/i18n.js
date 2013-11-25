(function($){

    $.fn.i18n = function(){

        var itemsToTranslate = this.find('.i18n');

        itemsToTranslate.each(function(){
            var i18nKey = $(this).attr('data-i18n-key');

            if(i18nKey && i18n.strings[i18nKey]){
                $(this).html(i18n.strings[i18nKey]);
            }
        });

        return this;
    }

})(jQuery);

//translate strings on page ready
$(document).ready(function(){
    $('body').i18n();
})