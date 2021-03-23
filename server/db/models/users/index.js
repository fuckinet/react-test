const sequelize = require('sequelize');

const Database = require('../../../db');
const usersInitialData = require('../../initialData/users');

class Users extends sequelize.Model {}
Users.init({
  id: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: sequelize.STRING(32),
    allowNull: false
  },
  password: {
    type: sequelize.CHAR(64),
    allowNull: false
  },
  admin: {
    type: sequelize.INTEGER(1),
    allowNull: true
  },
  createdAt: sequelize.DATE,
  updatedAt: sequelize.DATE
}, {
  sequelize: Database.getConnection(),
  modelName: 'users',
  tableName: 'users'
});

Users.sync().then(() => {
  Users.bulkCreate(usersInitialData, {
    ignoreDuplicates: true
  }).catch((error) => {
    console.error('Unable to create initial data for `users` table', error);
  });
});

module.exports = Users;
