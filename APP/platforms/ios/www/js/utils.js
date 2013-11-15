var utils = {
    getBase64FromImage: function(img, extension) {
        var canvas = document.createElement("canvas");

        canvas.width =img.width;
        canvas.height =img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        return canvas.toDataURL("image/" + extension);
    },

    dateFormat : function(date, format) {
        var zeroPad = function(number) {
                return ("0"+number).substr(-2,2);
            },

            o = {
                "m" : zeroPad(date.getMonth()+1), //month
                "d" : zeroPad(date.getDate()),    //day
                "h" : zeroPad(date.getHours()),   //hour
                "m" : zeroPad(date.getMinutes()), //minute
                "s" : zeroPad(date.getSeconds()),  //second
                "y" : date.getFullYear(),
                "l" : i18n.strings["days"][date.getDay()], // textual representation of a day of week
                "F" : i18n.strings["months"][date.getMonth()]  //textual representation of a month
            };


        for(var k in o){
            var tmp = new RegExp("("+ k +")");

            if(tmp.test(format)){
                format = format.replace(k, o[k]);
            }
        }

        return format;
    },

    //looks for the url parameter and returns a vale if wont. else emtpy string. For exmaple: 
    //http://www.foo.com/index.html?bob=123&frank=321&tom=213#top
    //to get te value frank use: var frank_param = utils.getUrlParameter( 'frank' );
    getUrlParameter: function ( name ){
name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
var regexS = "[\\?&]"+name+"=([^&#]*)";  
var regex = new RegExp( regexS );  
var results = regex.exec( window.location.href ); 
if( results == null )    return "";  
else    return results[1];}

}
