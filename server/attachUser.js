const { Op } = require('sequelize');

const Users = require('./db/models/users');

async function getAccountByToken(token) {
  return await Users.findOne({
    where: {
      token: { [Op.eq]: token }
    }
  });
}

module.exports = async (req, res, next) => {
  const { token } = req;
  const userRecord = await getAccountByToken(token);

  req.currentUser = userRecord;

  if (!userRecord) {
    return res.status(401).end('Ошибка авторизации!')
  }
  next();
};
