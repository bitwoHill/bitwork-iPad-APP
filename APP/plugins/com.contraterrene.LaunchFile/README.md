LaunchFile
==========

LaunchFile is a (very) simple iOS plugin for Phonegap/Cordova 3.0. It lets you launch a file from the device's file system using any application registered to handle that file type. I put this together because a) I needed the functionality and b) I wanted to learn how the new plugin model in 3.0 works.

LaunchFile is largely based on Andrew Trice's plugin described here: 

<http://www.tricedesigns.com/2012/08/15/open-with-in-ios-phonegap-apps/> 

with the following differences:

1. Andrew's plugin is designed to download a remote file and then open it, while LaunchFile assumes the file is already present on the local file system.
2. Andrew's code expects you to supply a UTI (Uniform Type Identifier). Unfortunately, the list of UTIs is incomplete/outdated, so that's not an option in some cases (for example, I wanted to open epub ebook files, which iBooks can obviously do -- but there's no published UTI for epub that I could find). Instead, LaunchFile lets the system pick the apps that it thinks can open the specified file (for example, on my devices, an epub file gets you iBooks, Dropbox, Mail, and Copy).
3. LaunchFile assumes ARC.
4. LaunchFile (obviously) is organized and packaged to work with 3.0.

To install:

cordova plugin add https://github.com/tonyhursh/LaunchFile.git

To remove:

cordova plugin rm com.contraterrene.LaunchFile


Simple example (using my [gapfile](https://github.com/tonyhursh/gapfile "Gapfile") library):

		function writeSuccess(fileURL){
            console.log("File URL is " + fileURL);
			LaunchFile(fileURL);
        }
		function writeFail(){
			alert("Write failed.");
		}
		function testLaunchFile(){
			gapFile.writeFile("/hello.txt","Hello, world!",writeSuccess,writeFail);
		}

This is only for iOS, but I'd be happy to look at pull requests that add similar functionality for Android or other platforms.






