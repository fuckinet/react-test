const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Joi = require('joi');
const FormData = require('form-data');

const apiHandler = require('../apiHandler');
const Users = require('../db/models/users');
const { PropertyError } = require('../utils');

async function getAccountByUsername(login) {
  const user = await Users.findOne({
    where: {
      username: { [Op.eq]: login }
    }
  });
  if (!user) {
    throw new PropertyError('Логин или пароль указан не верно!')
  }
  return user;
}
async function isPasswordsEquals(password, hash) {
  return await bcrypt.compare(password, hash);
}

const authenticateSchema = Joi.object().keys({
  login: Joi.alternatives().try(
    Joi.string().email({ minDomainSegments: 2 }),
    Joi.string().regex(/^[a-zA-Z0-9\-_]{3,24}$/).required()
  ).required()
    .error(() => (new PropertyError('Логин неверного формата!'))),
  password: Joi.string().regex(/^[a-zA-Z0-9!@#$%^&*()-=+/\\<>';\]\[\{\}:]{3,30}$/).required()
    .error(() => (new PropertyError('Пароль должен содержать минимум 3 и не более 30 символов!')))
});

module.exports = {
  async post(req, res) {
    try {
      const { login, password } = req.body;
      if (!login.toString() || login.toString().length < 3 || login.toString().length > 24) {
        return res.json({
          error: {
            code: 2,
            message: 'Логин или пароль указан не верно!'
          }
        });
      }
      if (!password.toString() || password.toString().length < 3 || password.toString().length > 30) {
        return res.json({
          error: {
            code: 3,
            message: 'Логин или пароль указан не верно!'
          }
        });
      }
      const { error } = authenticateSchema.validate({ login, password });
      if (error) {
        return res.json({
          error: {
            code: 4,
            message: error.message
          }
        });
      }
      const form = new FormData();
      form.append('username', login);
      form.append('password', password);
      const { data } = await apiHandler.post('/login', form, form.getHeaders());
      if (data.status !== 'ok') {
        return res.json({
          error: {
            code: 5,
            message: 'Логин или пароль указан не верно!'
          }
        });
      }
      const account = await getAccountByUsername(login);
      if (!await isPasswordsEquals(password, account.password)) {
        return res.json({
          error: {
            code: 1,
            message: 'Логин или пароль указан не верно!'
          }
        });
      }
      account.update({
        token: data.message.token
      });
      res.json({
        id: account.id,
        token: account.token
      });
    }
    catch (e) {
      if (e instanceof PropertyError) {
        return res.json({
          error: {
            code: 10,
            message: e.message
          }
        });
      }
      res.status(500).send({
        error: {
          code: -1,
          message: 'Please report an administrator!'
        }
      });
    }
  }
};
