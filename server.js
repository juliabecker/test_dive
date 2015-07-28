// Establish app dependencies
var express = require('express');
var fs = require('fs');
var morgan = require('morgan');
var mustache = require('mustache');
var bodyParser = require('body-parser')
var session = require('express-session')

// Initialize app & dependencies
var app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(session({
  secret: 'cat'
}));

// Include templates
var templates = require("./views/views.js");

// Establish session as global variable
var sess;

// Index route
// Redirect to login if user not logged in (no username stored in session)
// Otherwise, display index page with user's username
app.get('/', function(req, res) {
  sess = req.session;

  if (sess.username) {
    var indexTemplate = mustache.render(templates.index(), {
      "templates": templates,
      "user": sess.username
    });
    res.send(indexTemplate);
  } else {
    res.redirect('/login');
  }

});

// Login route
// Redirect to index page if user logged in
// Otherwise, display login form 
app.get('/login', function(req, res) {
  sess = req.session;

  if (sess.username) {
    res.redirect('/')
  } else {
    var loginTemplate = mustache.render(templates.login(), {
      "templates": templates
    });
    res.send(loginTemplate);
  }
});

// Logout route
// Destroy session & redirect to login
app.get('/logout', function(req, res) {

  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/login');
    }
  });
});

// Login POST route
// Verifies user credentials and sends appropriate response to client in the form of "loginStatus"
// loginStatus === 1 if username & password are correct
// loginStatus === 0 if username is found, but password is incorrect
// loginStatus === 2 if username is not found
app.post('/login', function(req, res) {
  sess = req.session;
  var userInput = req.body;

  var loginStatus = checkUserCredentials(userInput);

  if (loginStatus === 1) {
    sess.username = userInput.username;
    res.json({
      username: userInput.username
    })
  } else if (loginStatus === 0) {
    res.json({
      loginStatus: 0
    });
  } else {
    res.json({
      loginStatus: 2
    });
  }
});


// Checks user-entered username & password against JSON db
// Returns 1 if username & password correct
// Returns 0 if username found, password incorrect
// Returns undefined if username not found
function checkUserCredentials(userInputObj) {
  var allUserJSON = fs.readFileSync('db.json', 'utf8');
  var allUserData = JSON.parse(allUserJSON).users;
  var response;

  for (i = 0; i < allUserData.length; i++) {
    var user = allUserData[i];

    if (user.username.toLowerCase() === userInputObj.username.toLowerCase()) {
      if (user.password === userInputObj.password) {
        response = 1;
        break;
      } else {
        response = 0;
        break;
      }
    }
  }
  return response;
}

app.listen(3000, function() {
  console.log("Listening on port 3000");
});