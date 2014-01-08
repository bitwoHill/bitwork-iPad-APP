var DownloadModel = {};

(function ($) {
    DownloadModel.deleteAllFolders = function () {
        var def = $.Deferred(),
            removeDir1 = DownloadModel.removeDir("Dokumente"),
            removeDir2 = DownloadModel.removeDir("Infothek");

        $.when(removeDir1, removeDir2)
            .done(
                function (rem1, rem2) {
                    def.resolve()
                }
            ).fail(
                function (rem1, rem2) {
                    def.reject();
                }
            );

        return def.promise();
    };

    DownloadModel.removeDir = function (dirName) {
        var root,
            def = $.Deferred();

        try {
            window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                function (fileSystem) {
                    root = fileSystem.root;
                },
                function () {
                    def.reject();
                }
            );
        } catch (err) {
            def.reject();
        }

        var remove_dir = function (entry) {
            entry.removeRecursively(
                function (parent) {
                    def.resolve(parent);
                },
                function (err) {
                    def.reject(err);
                }
            );
        };

        // retrieve a file and truncate it
        root.getDirectory(dirName, { create: false }, remove_dir, onFileSystemError);

        return def.promise();
    };



    var downloadsQueue = $({});

    $.downloadQueue = function (data) {
        var jqXHR,
            dfd = $.Deferred(),
            promise = dfd.promise();

        // run the actual query
        function doDownload(next) {

            function download(downloadData) {
                var download = $.Deferred();

                try {
                    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
                    //  window.requestFileSystem(window.PERSISTENT, 4096 * 1024 * 1024, initFS, errorHandler);
                    window.requestFileSystem(window.PERSISTENT, 0, initFS, errorHandler);

                } catch (err) {
                    download.reject(err);
                }

                function initFS(fs) {

                    try {
                        //console.debug(downloadData);
                        var folderName = downloadData.folderName,
                            fileName = downloadData.fileName,
                            folderDir,
                            fileDir,
                            uri = encodeURI("http://" + appUser.username + ":" + appUser.password + "@www.atlas-cms.com" + downloadData.path),
                            ft = new FileTransfer();

                        fs.root.getDirectory(
                            folderName,
                            { create: true, exclusive: false },
                            function (dirEntry) {
                                folderDir = dirEntry;

                                //Create File. somehow this needs to be done first before the download started
                                folderDir.getFile(
                                    fileName,
                                    { create: true, exclusive: false },
                                    function (fileEntry) {
                                        fileDir = fileEntry;

                                        //created the files hull needed for download. Save the path.
                                        var fullpath = fileDir.fullPath.replace(fileName, "");

                                        // now delete the file (for what ever reason)
                                        fileDir.remove();
                                        ft.download(
                                              uri,
                                              fullpath + fileName,
                                              function (entry) {

                                                  console.debug("Download success!" + entry.fullPath);
                                                  download.resolve(entry);
                                              },
                                              function (error) {

                                                  alert("Fehler beim Herunterladen. Zeitüberschreitung " + error.code);
                                                  console.debug(error);
                                                  download.reject(error);
                                              },
                                              true
                                              );
                                    },
                                    function (error) {
                                        download.reject(error);
                                        // Base64.encode(appUser.username + ":" + appUser.password)
                                    }
                                );
                            },
                            function (error) {
                                download.reject(error);
                            }
                        );
                    } catch (err) {
                        download.reject(err);
                    }
                }

                function errorHandler() {
                    console.debug('An error occured');
                    alert("Could not create Filesystem. Not enough Local Storage available");
                    download.reject();
                }

                return download.promise()
            }

            jqXHR = download(data)
                .done(dfd.resolve)
                .fail(dfd.reject)
                .then(next, next);

        }

        // queue our ajax request
        downloadsQueue.queue(doDownload);

        promise.abort = function (statusText) {

            downloadsQueue.clearQueue();

            return promise;
        };

        return promise;
    }

})(jQuery);
