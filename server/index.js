const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const authCheck = require('./authCheck');
const attachUser = require('./attachUser');

const tasksRoutes = require('./routes/tasks');
const AuthRoute = require('./routes/auth');

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/tasks', tasksRoutes.get);
app.post('/api/tasks', tasksRoutes.post);
app.post('/api/auth', AuthRoute.post);
app.put('/api/tasks/:id', authCheck, attachUser, (req, res) => {
  // TODO
});

app.get('*', (req,res) =>{
  res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

const port = process.env.PORT || 3001;
app.listen(port);

console.log(`Api server started on *:${port}`);
