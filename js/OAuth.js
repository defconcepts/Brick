
var OAuth = (function() {

  var OAuth = osmAuth({
    landing: config.oauth.landingPage,
    oauth_consumer_key: config.oauth.consumerKey,
    oauth_secret: config.oauth.secret //,
  //    done: function() {
  //      if (!OAuth.authenticated()) {
  //        Bus.emit('AUTH_LOGOUT');
  //      } else {
  //        getUserInfo();
  //      }
  //    }
  });

  function getUserInfo() {
    OAuth.xhr({
      method: 'GET',
      path: '/api/0.6/user/details'
    }, function(err, res) {
      var user = JXON.build(res.getElementsByTagName('user')[0]);
      Bus.emit('AUTH_LOGIN', user);
    });
  }

  if (!OAuth.authenticated()) {
    Bus.emit('AUTH_LOGOUT');
  } else {
    getUserInfo();
  }

  Bus.on('SESSION_LOGIN', function() {
    OAuth.authenticate(function() {
      getUserInfo();
    });
  });

  Bus.on('SESSION_LOGOUT', function() {
    OAuth.logout();
    Bus.emit('AUTH_LOGOUT');
  });

  return OAuth;

}());
