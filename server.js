var express = require('express');
var fs = require('fs');
var morgan = require('morgan');
var mustache = require('mustache');
var bodyParser = require('body-parser')
var session = require('express-session')

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

// Login view
app.get('/login', function(req, res) {
  sess = req.session;

  if (sess.loginStatus === 0) {
    console.log('login status 0')
  }

  var loginTemplate = mustache.render(templates.login(), {
    "templates": templates
  });
  res.send(loginTemplate);
});


app.get('/logout', function(req, res) {

  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

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


  // if (loginStatus === 1) {
  //   sess.username = userInput.username;
  //   res.status(200).send({redirect: '/'});
  //   console.log('response code 200')
  // } else if (loginStatus === 0) {
  //   sess.loginStatus = 0;
  //   res.send({redirect: '/login'});
  //   console.log('response code 401')
  // } else {
  //   sess.loginStatus = 2;
  //   res.send({redirect: '/login'});
  //   console.log('response code 401')
  // }
});



app.listen(3000, function() {
  console.log("Listening on port 3000");
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