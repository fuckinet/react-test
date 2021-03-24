module.exports = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    req.token = req.headers.authorization.split(' ')[1];
    return next();
  }
  res.status(401).end('Токен не указан!')
};
