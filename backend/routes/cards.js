const routerCards = require('express').Router();

const {
  validateCardId,
  validateCreateCard,
} = require('../middlewares/validation');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

routerCards.get('/', getCards);

routerCards.post('/', validateCreateCard, createCard);

routerCards.delete('/:cardId', validateCardId, deleteCard);

routerCards.put('/:cardId/likes', validateCardId, likeCard);

routerCards.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = routerCards;
