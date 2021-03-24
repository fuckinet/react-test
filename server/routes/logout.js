module.exports = {
  async post(req, res) {
    if (!req.currentUser) {
      return res.json({
        error: {
          message: 'У Вас нет доступа!'
        }
      });
    }
    req.currentUser.update({
      token: ''
    });
    res.status(200).end();
  }
};
