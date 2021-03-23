const express = require('express');
const FormData = require('form-data');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const validator = require('validator');

const apiHandler = require('./apiHandler');
const utils = require('./utils');

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/tasks', async (req, res) => {
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
});

app.post('/api/tasks', async (req, res) => {
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
});

app.get('*', (req,res) =>{
  res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

const port = process.env.PORT || 3001;
app.listen(port);

console.log(`Api server started on *:${port}`);
