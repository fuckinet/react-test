const { Op } = require('sequelize');

const Users = require('./db/models/users');

async function getAccountById(id) {
  return await Users.findOne({
    where: {
      id: { [Op.eq]: id }
    }
  });
}

module.exports = async (req, res, next) => {
  const decodedTokenData = req.token;
  const userRecord = await getAccountById(decodedTokenData.data.id);

  req.currentUser = userRecord;

  if (!userRecord) {
    return res.status(401).end('Ошибка авторизации!')
  }
  next();
};
