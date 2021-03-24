const FormData = require('form-data');
const validator = require('validator');

const apiHandler = require('../apiHandler');
const utils = require('../utils');

module.exports = {
  async post(req, res) {
    const { name: _name = '', email = '', text: _text = '' } = req.body;
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
  },
  async put(req, res) {
    if (!req.currentUser.admin) {
      return res.json({
        error: {
          message: 'У Вас нет доступа!'
        }
      });
    }
    const { id } = req.params;
    const { field: _field, newValue: _newValue } = req.body;
    const field = utils.htmlEscape(_field);
    const newValue = utils.htmlEscape(_newValue);
    if (!id && !field && !newValue) {
      return res.json({
        error: {
          message: 'Произошла ошибка! Не выбраны поля редактирования!'
        }
      });
    }
    if (field !== 'text' && field !== 'status') {
      return res.json({
        error: {
          message: 'Произошла ошибка! Указанное поле нельзя отредактировать!'
        }
      });
    }
    const form = new FormData();
    form.append(field, newValue);
    form.append('token', req.currentUser.token);
    const { data } = await apiHandler.post(`/edit/${id}`, form, form.getHeaders());
    if (data.status !== 'ok') {
      return res.json({
        error: {
          message: 'Произошла ошибка при обновлении задачи!'
        }
      });
    }
    res.json({ id: parseInt(id, 10), field, newValue });
  }
};
