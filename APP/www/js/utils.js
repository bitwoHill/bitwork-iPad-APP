var utils = {

    addDots: function (nStr) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(d+)(d{3})/;

        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + '.' + '$2');
        }
        alert(x1 + x2);
        return x1 + x2;
    },
    number_format: function (number, decimals, dec_point, thousands_sep) {
        number = (number + '').replace(/[^0-9+-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/B(?=(?:d{3})+(?!d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    },
    CommaFormatted: function (amount) {
        var delimiter = "."; // replace comma if desired
        amount = new String(amount);
        var a = amount.split('.', 2);
        var d = a[1];
        var i = parseInt(a[0]);
        if (isNaN(i)) { return ''; }
        var minus = '';
        if (i < 0) { minus = '-'; }
        i = Math.abs(i);
        var n = new String(i);
        var a = [];
        while (n.length > 3) {
            var nn = n.substr(n.length - 3);
            a.unshift(nn);
            n = n.substr(0, n.length - 3);
        }
        if (n.length > 0) { a.unshift(n); }
        n = a.join(delimiter);
        if (d.length < 1) { amount = n; }
        else { amount = n + '.' + d; }
        amount = minus + amount;
        return amount;
    },
    /**
    *    Usage:     CommaFormatted(12345678);
    *    result:    12,345,678
    **/

    getBase64FromImage: function (img, extension) {
        var canvas = document.createElement("canvas"),
            base64Image = img.src;

        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        try {
            base64Image = canvas.toDataURL("image/" + extension);
        } finally {
            return base64Image;
        }
    },

    dateFormat: function (date, format) {
   // 	 console.log(date);
        var zeroPad = function (number) {
            return ("0" + number).substr(-2, 2);
        },

            o = {
                "m": zeroPad(date.getMonth() + 1), //month
                "d": zeroPad(date.getDate()),    //day
                "H": zeroPad(date.getHours()),   //hour
                "M": zeroPad(date.getMinutes()), //minute
                "s": zeroPad(date.getSeconds()),  //second
                "y": date.getFullYear(),
                "l": i18n.strings["days"][date.getDay()], // textual representation of a day of week
                "F": i18n.strings["months"][date.getMonth()]  //textual representation of a month
            };


        for (var k in o) {
            var tmp = new RegExp("(" + k + ")");

            if (tmp.test(format)) {
                format = format.replace(k, o[k]);
            }
        }
//console.log(format);
        return format;
    },

    //looks for the url parameter and returns a vale if wont. else emtpy string. For exmaple: 
    //http://www.foo.com/index.html?bob=123&frank=321&tom=213#top
    //to get te value frank use: var frank_param = utils.getUrlParameter( 'frank' );
    getUrlParameter: function (name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);

        if (results == null)
            return "";
        else
            return decodeURIComponent(results[1]);
    },

    //Parse date from data format SharePoint date type
    //e.g.: "/Date(1365081254000)/"
    parseSharePointDate: function (spDate) {
        return new Date(parseInt(spDate.match(/\/Date\(([0-9]+)(?:.*)\)\//)[1]));
    },

    setCookie: function (name, value, expirationDate) {
        var c_value = encodeURIComponent(value) + ((expirationDate == null) ? "" : "; expires=" + expirationDate.toUTCString());
        document.cookie = name + "=" + c_value;
    },

    getCookie: function (c_name) {
        var c_value = document.cookie,
            c_start = c_value.indexOf(" " + c_name + "=");

        if (c_start == -1) {
            c_start = c_value.indexOf(c_name + "=");
        }

        if (c_start == -1) {
            c_value = null;
        } else {
            c_start = c_value.indexOf("=", c_start) + 1;
            var c_end = c_value.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = c_value.length;
            }
            c_value = decodeURIComponent(c_value.substring(c_start, c_end));
        }

        return c_value;
    },

    deleteCookie: function (name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },

    emptySearchIndex: function (type) {
        var conn = openDatabase("bitwork_ipadapp", '1.0', "bitwork iPadApp database", 10 * 1024 * 1024);

        conn.transaction(function (tx) {
            tx.executeSql("DELETE FROM " + type + "_Index");
        });
    }

};

//Base64 encoding

var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

};