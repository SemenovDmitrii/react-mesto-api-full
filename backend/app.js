require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validateUser, validateAuthorization } = require('./middlewares/validation');
const NotFoundError = require('./errors/NotFoundError');
const errorHandler = require('./middlewares/error-handler');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(cors);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', validateAuthorization, login);

app.post('/signup', validateUser, createUser);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/users', auth, routerUsers);

app.use('/cards', auth, routerCards);

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
