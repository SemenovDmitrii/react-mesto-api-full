const bcrypt = require('bcryptjs');
const { generateToken } = require('../middlewares/jwt');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else res.send({ user });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => User.findById(req.params.user._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    } else res.send({ user });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new BadRequestError(
        'Переданы некорректные данные при создании пользователя.',
      );
    }
    next(err);
  })
  .catch(next);

module.exports.createUser = (req, res, next) => {
  const {
    email, name, about, avatar, password,
  } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    })
      .then((user) => res
        .status(201)
        .send({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        }))
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
        throw new NotFoundError('Пользователь с указанным _id не найден.');
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
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверный пароль или почта');
      } else {
        return bcrypt
          .compare(password, user.password)
          .then((isPasswordCorrect) => {
            if (!isPasswordCorrect) {
              throw new UnauthorizedError('Неверный пароль или почта');
            } else {
              const token = generateToken({ _id: user._id.toString() });
              res.send({ token });
            }
          }).catch(() => next(new UnauthorizedError('Неверный пароль или почта')));
      }
    })
    .catch(next);
};
