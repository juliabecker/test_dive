var express = require('express');
var fs = require('fs');
var morgan = require('morgan');

var app = express();

app.use(morgan('dev'));

// Login view
app.get('/login', function(req, res) {
  var template = fs.readFileSync('./views/login.html', 'utf8');

  res.send(template);

})

app.listen(3000, function() {
  console.log("Listening on port 3000");
});