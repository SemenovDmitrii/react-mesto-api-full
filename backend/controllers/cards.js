const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => {
      res.send({ card });
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ owner, name, link })
    .then((card) => {
      res.status(201).send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные. Не удалось создать новую карточку'));
        return;
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным id не найдена'));
        return;
      }
      if (card.owner.toString() !== req.user._id.toString()) {
        next(new ForbiddenError('Невозможно удалить чужую карточку'));
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          .then((data) => {
            res.send({ data });
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные. Не удалось удалить карточку'));
        return;
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным id не найдена'));
        return;
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Данные для постановки лайка некорректны'));
        return;
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным id не найдена'));
        return;
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Данные для удаления лайка некорректны'));
        return;
      }
      next(err);
    });
};
