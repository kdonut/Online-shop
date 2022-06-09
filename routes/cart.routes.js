const express = require('express');

const cartController = require('../controllers/cart.controller');

const router = express.Router();

router.get('/items/:id',cartController.addCartItem);// /cart/items - patrz app.js

router.get('/',cartController.getCart); // /cart/

router.patch('/items',cartController.updateCartItem)//gdy edycja czesci danych
router.get('/items/update/:id/:quantity',cartController.updateCartItem);


module.exports = router;

