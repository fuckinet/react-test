const jwt = require('express-jwt');
const jwtSecret = require('config').get('Application.jwtSecret');

module.exports = jwt({
  secret: jwtSecret,
  userProperty: 'token',
  algorithms: ['HS256'],
  getToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
  }
});
