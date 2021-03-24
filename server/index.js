const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const authCheck = require('./authCheck');
const attachUser = require('./attachUser');

const tasksRoutes = require('./routes/tasks');
const authRoute = require('./routes/auth');
const logoutRoute = require('./routes/logout');

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.static(path.join(__dirname, '../client/build')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/tasks', tasksRoutes.get);
app.post('/api/tasks', tasksRoutes.post);
app.post('/api/auth', authRoute.post);
app.post('/api/logout', authCheck, attachUser, logoutRoute.post);
app.put('/api/tasks/:id', authCheck, attachUser, tasksRoutes.put);

app.get('*', (req,res) =>{
  res.sendFile(path.join(`${__dirname}/../client/build/index.html`));
});

const port = process.env.PORT || 3001;
app.listen(port);

console.log(`Api server started on *:${port}`);
