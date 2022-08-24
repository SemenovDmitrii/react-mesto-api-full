const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const User = require('../models/user');
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    } else res.send({ user });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError(
        'Переданы некорректные данные при создании пользователя.',
      ));
    } else {
      next(err);
    }
  })
};

module.exports.createUser = (req, res, next) => {
  const {
    email, name, about, avatar, password,
  } = req.body;
  if (!email || !password) {
    return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
  }
  return bcrypt
  .hash(password, 10)
  .then((hash) => {
    User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    })
      .then(({ _id }) => {
        User.findById(_id).select()
        .then((user) => res.status(201).send(user));
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError('Вееденный email уже зарегестрирован'));
          return;
        }
        if (err.name === 'ValidationError') {
          next(
            new BadRequestError(
              `Переданы некорректные данные при создании пользователя: ${err}`,
            ),
          );
        } else {
          next(err);
        }
      });
  });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь с указанным _id не найден.'));
      } else res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(
          'Переданы некорректные данные при создании пользователя.',
        ));
      }
      next(err);
    })
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  if (typeof avatar !== 'string') {
    throw new BadRequestError(
      'Переданы некорректные данные при обновлении аватара.',
    );
  }
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден.');
      } else res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Переданы некорректные данные при создании пользователя.',
        );
      }
      next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        {
          expiresIn: '7d',
        },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
        })
        .status(200)
        .send({ message: 'Успешная авторизация.' });
    })
    .catch(() => {
      next(new UnauthorizedError('Неверный пароль или почта'));
    })
    .catch(next);
};

module.exports.logout = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res
        .clearCookie('jwt')
        .status(200)
        .send({ message: 'До встречи!' });
    })
    .catch(next);
};

module.exports.cookiesCheck = (req, res) => {
  const cookie = req.cookies;
  if (!cookie) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  const token = cookie.jwt;
  try {
    jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
    res.send({ message: 'OK' });
  } catch (err) {
    res.send({ message: 'Unauthorized' });
  }
};
