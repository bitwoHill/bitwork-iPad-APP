var Users = persistence.define('Users', {
    username: "TEXT",
    password: "TEXT",
    lastLoginDate: "DATE"
});

Users.index('username', { unique: true });

var User = function () {
    var username,
        password,
        SPTestList = "WichtigeLinks",
        loginPageUrl = "LoginPage.html",

        doLogin = function (user, pass, rememberUser) {
             
console.log(user + ' ' + pass);
            var jqXHR = $.ajax({
                type: 'GET',
                url: Settings.spDomain + "/" + SPTestList,
                crossDomain: true,
                timeout: 10000,
                username: encodeURIComponent(user),
                password: encodeURIComponent(pass),
                contentType: "application/json; charset=utf-8",
                dataType: 'json'
            }).done(
                function (responseData, textStatus, jqXHR) {
                    loginSuccessful(user, pass, rememberUser);
                }
            ).fail(
                function (responseData, textStatus, errorThrown) {
                    console.log(responseData);
                         console.log(textStatus);
                              console.log(responseData);
                    if (responseData) {
                        if (responseData.status && responseData.status === 401) { //if Unauthorized status -> login failed
                            loginFailed();
                        } else { //other fail status -> check if user in DB
                            checkDBUser(user, pass);
                        }
                    }

                }
            );
        },

        doLogout = function () {
            utils.deleteCookie('bitwork_ipadapp_auth');
            setLoginCounter(0);
            this.username = "";
            this.password = "";

            var currentPageURL = window.location.pathname;

            //removal of server path in front of url //.pathname returns to much on PhoneGap. for exmaple it returns /app/infothek.html instead of infothek.html. The /app/ needs to be cut away
            var res = currentPageURL.split("/");
            currentPageURL = res[res.length - 1];

            //Check if user is in login page
            if (currentPageURL.indexOf(loginPageUrl) === -1) {
                //redirect to login page


                window.open(loginPageUrl + "?returnURL=" + encodeURIComponent(currentPageURL), "_self");
            }
        },

        loginSuccessful = function (user, pass, rememberUser) {
            var expDate = new Date(),
                expDelay = (rememberUser) ? Settings.loginExpirationExtended : Settings.loginExpiration;

            expDate.setTime(expDate.getTime() + expDelay * 60 * 60 * 1000);

            utils.setCookie('bitwork_ipadapp_auth', Base64.encode(user + ":" + pass), expDate);


            Users.all().filter("username", "=", user).destroyAll(function () {
                persistence.add(new Users({
                    username: user,
                    password: Base64.encode(pass),
                    lastLoginDate: new Date()
                }));
                persistence.flush(function () {
                    $('body').trigger('login-successful');
                    setLoginCounter(0);
                });
            });
        },

        loginFailed = function () {
            utils.deleteCookie('bitwork_ipadapp_auth');
            $('body').trigger('login-failed');

            checkLoginCounter();
        },

        setLoginCounter = function (cnt) {
            var expDate = new Date();
            expDate.setTime(expDate.getTime() + Settings.loginFailedAttemptsExpiration * 60 * 60 * 1000)

            utils.setCookie('bitwork_ipadapp_auth_failed_cnt', cnt, expDate);
        },

        checkLoginCounter = function () {
            var loginAttemptsCookie = parseInt(utils.getCookie("bitwork_ipadapp_auth_failed_cnt"), 10),
                loginAttempts = (loginAttemptsCookie) ? loginAttemptsCookie + 1 : 1;

            if (loginAttempts === Settings.loginFailedAttempts) {
                //try to delete all files and folder
                DownloadModel.deleteAllFolders().always(
                    function () {
                        //reset DB
                        persistence.reset(function () {
                            alert(i18n.strings["db-reset"]);
                            setLoginCounter(0);
                        });
                    }
                )

            } else {
                setLoginCounter(loginAttempts);
            }
        },

        checkDBUser = function (user, pass) {

            Users.all().filter("username", "=", user).list(null, function (res) {
                if (res && res.length) {
                    if (res[0] && res[0]._data && pass === Base64.decode(res[0]._data.password)) {
                        loginSuccessful(user, pass);
                    } else {
                        loginFailed();
                    }
                } else {
                    loginFailed();
                }
            });

        },

        setCurrentUser = function (callback) {
            var authCookie = utils.getCookie("bitwork_ipadapp_auth"),
                currentPageURL = window.location.pathname;
            if (authCookie) {

                var tmp = Base64.decode(authCookie);
                tmp = tmp.split(":");
                this.username = tmp[0];
                this.password = tmp[1];
            } else {


                //removal of server path in front of url //.pathname returns to much on PhoneGap. for exmaple it returns /app/infothek.html instead of infothek.html. The /app/ needs to be cut away

                var res = currentPageURL.split("/");

                currentPageURL = res[res.length - 1];

                //Check if user is in login page
                if (currentPageURL.indexOf(loginPageUrl) === -1) {
                    //redirect to login page
                    window.open(loginPageUrl + "?returnURL=" + encodeURIComponent(currentPageURL), "_self");
                }
            }

            if (typeof callback === "function") {
                callback();
            }
        };

    return {
        doLogin: doLogin,
        doLogout: doLogout,
        initUser: setCurrentUser,
        username: username,
        password: password
    }
}