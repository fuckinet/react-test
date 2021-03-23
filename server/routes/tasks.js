const FormData = require('form-data');
const validator = require('validator');

const apiHandler = require('../apiHandler');
const utils = require('../utils');

module.exports = {
  async post(req, res) {
    const { name: _name, email, text: _text } = req.body;
    if (!_name && !email && !_text) {
      return res.json({
        error: {
          message: 'Заполните все поля!'
        }
      });
    }
    const name = utils.htmlEscape(_name);
    const text = utils.htmlEscape(_text);
    if (!validator.isEmail(email)) {
      return res.json({
        error: {
          message: 'E-mail указан не верно!'
        }
      });
    }
    const form = new FormData();
    form.append('username', name);
    form.append('email', email);
    form.append('text', text);
    const result = await apiHandler.post('/create', form, form.getHeaders());
    const { data } = result;
    console.log(data);
    if (data.status === 'ok') {
      res.json(data.message);
    }
    else {
      res.json({
        error: {
          message: 'Произошла ошибка при создании задачи!'
        }
      });
    }
  },
  async get(req, res) {
    const { page = 1, sort = 'id', sortDirection = 'desc' } = req.query;
    const { data } = await apiHandler.get('/', {
      page, sort_field: sort, sort_direction: sortDirection
    });
    if (data.status === 'ok') {
      res.json(data.message);
    }
    else {
      res.json({
        error: {
          message: 'Произошла ошибка при получении списка задач!'
        }
      });
    }
  }
};
