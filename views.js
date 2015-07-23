var fs = require('fs');

module.exports = {
  header: function() {
    var headerTemplate = fs.readFileSync('views/header.html', 'utf8');
    return headerTemplate;
  },

  footer: function() {
    var footerTemplate = fs.readFileSync('views/footer.html', 'utf8'); 
    return footerTemplate;
  },

  login: function() {
    var loginTemplate = fs.readFileSync('views/login.html', 'utf8');
    return loginTemplate;
  }
}