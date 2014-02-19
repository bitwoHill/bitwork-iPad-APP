exec = require('cordova/exec')
LaunchFile = function(str, callback){
        exec(callback, function(err) {
            callback('File name not supplied');
        }, "LaunchFile", "launchFile", [str]);
};
module.exports = LaunchFile;