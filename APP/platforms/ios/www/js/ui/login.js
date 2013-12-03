var LOGIN_FORM_ID = "#login-form",
    LOGIN_DEFAULT_REDIRECT = "News.html";

var LoginUI = {
    validateLoginForm : function($form){
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

    disableForm : function($form){
        $('input, button', $form).attr('disabled', 'disabled');
    },

    enableForm : function($form){
        $('input, button', $form).removeAttr('disabled');
    }
};

(function($){

    $(document).ready(function(){
        var $loginForm = $(LOGIN_FORM_ID);
            //alert(window.location.pathname);

        $('body').on('login-failed', function(){
            $('#login-failed-msg', $loginForm).show(200);
            LoginUI.enableForm($loginForm);
        });

        $('body').on('login-successful', function(){
            var redirectURL = decodeURIComponent(utils.getUrlParameter("returnURL"));
            if(redirectURL && redirectURL !== ""){
                window.open(redirectURL, "_self");
            } else {
                window.open(LOGIN_DEFAULT_REDIRECT, "_self");
            }
        });

        $('body').on('submit', LOGIN_FORM_ID, function(e){
            e.preventDefault();

            if(!LoginUI.validateLoginForm($(this))){
                return;
            }

            $('#login-failed-msg', $loginForm).hide();

            var $form = $(this),
                username = $('#txtUsername', $form).val(),
                password = $('#txtPassword', $form).val(),
                rememberUser = $("#remember-user").is(':checked');

            LoginUI.disableForm($form);
            appUser.doLogin(username, password, rememberUser);
        });
    })

})(jQuery);