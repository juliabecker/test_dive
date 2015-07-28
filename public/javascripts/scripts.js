$(document).ready(function() {

// var indexTemplate = $('script[data-id="index-template"]').text();

//   // Client-Side Routes
//   var routes = {
//     "/": showIndex,
//     // "/login": showLogin,
//   }

//   // Initialize router
//   var router = Router(routes);
//   router.init('/');

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
    postLoginInfo(userInfo).done(function(result) {
      if (result.username) {
        console.log('logged in');
        window.location.href = '/'
      } else if (result.loginStatus === 0) {
        showError('password')
      } else {
        showError('username')
      }
    })


  });

});

function clearError() {
  $('#username-group').removeClass('has-error');
  $('#password-group').removeClass('has-error');
  $('#username-error').hide();
  $('#password-error').hide();
}

function showError(field) {
  $('#' + field + '-group').addClass('has-error');
  $('input[name="' + field + '"]').focus();
  $('#' + field + '-error').show();
}

function showIndex(username) {
  $('body').append(Mustache.render(indexTemplate, {user: username}));
}

// Send user info to server
function postLoginInfo(userObj) {

  return $.ajax({
    url: '/login',
    method: 'POST',
    data: userObj
  });

}