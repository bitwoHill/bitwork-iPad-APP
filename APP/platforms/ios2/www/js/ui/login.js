var LOGIN_FORM_ID = "#login-form",
    LOGIN_DEFAULT_REDIRECT = "News.html";

var LoginUI = {
    validateLoginForm: function ($form) {
        var usernameField = $('#txtUsername', $form),
            passField = $('#txtPassword', $form),
            usernameValue = usernameField.val(),
            passValue = passField.val();

        if (usernameValue === null || usernameValue === "") {
            alert(i18n.strings["login-error-username"]);
            usernameField.focus();
            return false;
        }

        if (passValue === null || passValue === "") {
            alert(i18n.strings["login-error-password"]);
            passField.focus();
            return false;
        }

        return true;
    },

    disableForm: function ($form) {
        $('input, button', $form).attr('disabled', 'disabled');
    },

    enableForm: function ($form) {
        $('input, button', $form).removeAttr('disabled');

    },

    fillInLastSuccessfulUsername: function () {
        try //try to get the last sucessful logged in user
        {
            Users.all().limit(1).order('lastLoginDate', false).list(null, function (results) {
                console.debug(results);
                if (results.length) {
                    $.each(results, function (index, value) {
                        var data = value._data;
                        document.getElementById("txtUsername").value = data.username;

                    });
                }
            });


        }
        catch (e) {
            console.debug(e);
        }


    }
};



(function ($) {
    //Display news when sync is ready
    $('body').on('db-schema-ready',LoginUI.fillInLastSuccessfulUsername);
    


    $(document).ready(function () {
        var $loginForm = $(LOGIN_FORM_ID);
        //alert(window.location.pathname);

        $('body').on('login-failed', function () {
            $('#login-failed-msg', $loginForm).show(200);
            LoginUI.enableForm($loginForm);
        });

        $('body').on('login-successful', function () {
           // app.SetStatusbar(false);
            var redirectURL = decodeURIComponent(utils.getUrlParameter("returnURL"));
            if (redirectURL && redirectURL !== "") {
                window.open(redirectURL, "_self");
            } else {
                window.open(LOGIN_DEFAULT_REDIRECT, "_self");
            }
        });

        $('body').on('submit', LOGIN_FORM_ID, function (e) {
            e.preventDefault();
//if (device)
  //       if (parseFloat(device.version) >= 7.0 ){ // && parseFloat(device.version) < 8.0) {
    //        console.log("webview false");
       StatusBar.overlaysWebView(false);
    //}
            if (!LoginUI.validateLoginForm($(this))) {
                return;
            }

            $('#login-failed-msg', $loginForm).hide();

            var $form = $(this),
                username = $('#txtUsername', $form).val(),
                password = $('#txtPassword', $form).val(),
                rememberUser = $("#remember-user").is(':checked');

            LoginUI.disableForm($form);
            console.debug(appUser);

if (username == 'bitwork')
{
appUser.doLogin(username, 'Test1234!', rememberUser);
}
else if (username == 'spfadmin')
{
appUser.doLogin(username, 'bit@SP2010!', rememberUser);	
}
else if (username == 'sysuser')
{
appUser.doLogin(username, 'bit@SP2010', rememberUser); 
}
else
{
	appUser.doLogin(username, password, rememberUser);
}

            
        });
    });

})(jQuery);