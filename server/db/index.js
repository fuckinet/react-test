const Sequelize = require('sequelize');
const config = require('config').get('Application.dbConnection');

class Database {
  constructor() {
    this.connection = new Sequelize(
      config.database,
      config.user,
      config.password,
      {
        host: config.host,
        dialect: 'mariadb',
        dialectOptions: {
          timezone: 'Etc/GMT-3'
        },
        define: {
          charset: 'utf8',
          collate: 'utf8_general_ci',
          timestamps: true
        },
        timezone: '+03:00',
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
          evict: 5000
        }
      }
    );
  }

  getConnection() {
    return this.connection;
  }
}

module.exports = new Database();
