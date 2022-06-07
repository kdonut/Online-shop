const express = require('express');

const cartController = require('../controllers/cart.controller');

const router = express.Router();

router.get('/items/:id',cartController.addCartItem);// /cart/items - patrz app.js

router.get('/',cartController.getCart); // /cart/
module.exports = router;

