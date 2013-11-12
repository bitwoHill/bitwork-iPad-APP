var utils = {
    getBase64FromImage: function(img, extension) {
        var canvas = document.createElement("canvas");

        canvas.width =img.width;
        canvas.height =img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        return canvas.toDataURL("image/" + extension);
    }
}
