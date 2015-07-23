var express = require('express');
var fs = require('fs');
var morgan = require('morgan');
var mustache = require('mustache');
var bodyParser = require('body-parser')

var app = express();

app.use(morgan('dev'));
app.use(express.static('public'));

// Include templates
var templates = require("./views.js");


app.get('/', function(req, res) {
  res.redirect('/login')
});

// Login view
app.get('/login', function(req, res) {
  var loginTemplate = mustache.render(templates.login(), {
    "templates": templates
  });

  res.send(loginTemplate);

});

app.post('/login', function(req, res) {
  console.log("posted to login")
});

app.listen(3000, function() {
  console.log("Listening on port 3000");
});