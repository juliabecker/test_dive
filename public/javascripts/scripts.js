$(document).ready(function() {

  $('#login-form').submit(function(event) {
    event.preventDefault();

    var $form = $(this);
    var usernameInput = $form.find('[name="username"]').val();
    var passwordInput = $form.find('[name="password"]').val();

    var userInfo = {"username": usernameInput, "password": passwordInput};

    postLoginInfo(userInfo);

  });

});

// Send user info to server
// On success, user redirected to index page
function postLoginInfo(userObj) {
    $.ajax({
        url: "/login",
        method: "POST",
        data: userObj
    }).success( function(data, textStatus, jqXHR) {
        if (typeof data.redirect == 'string') {
          window.location = data.redirect
        }
    });
}