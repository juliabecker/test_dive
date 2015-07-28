$(document).ready(function() {

  // Login form submitted
  $('#login-form').submit(function(event) {
    event.preventDefault();

    // Clear any existing error messages from the form
    clearError();

    var $form = $(this);
    var usernameInput = $form.find('[name="username"]').val();
    var passwordInput = $form.find('[name="password"]').val();

    var userInfo = {
      "username": usernameInput,
      "password": passwordInput
    };

    // Verify credentials on server
    // Display error on page if username or password incorrect
    // Otherwise, redirect to index route
    postLoginInfo(userInfo).done(function(result) {
      if (result.username) {
        window.location.href = '/'
      } else if (result.loginStatus === 0) {
        showError('password')
      } else {
        showError('username')
      }
    })

  });

});

// Removes error messages from login form
function clearError() {
  $('#username-group').removeClass('has-error');
  $('#password-group').removeClass('has-error');
  $('#username-error').hide();
  $('#password-error').hide();
}

// Displays error message on form, given which field is incorrect (username or password)
function showError(field) {
  $('#' + field + '-group').addClass('has-error');
  $('input[name="' + field + '"]').focus();
  $('#' + field + '-error').show();
}

// Send user entered credentials to server for verification
function postLoginInfo(userObj) {

  return $.ajax({
    url: '/login',
    method: 'POST',
    data: userObj
  });

}