const express = require('express');

const router = express.Router();
const adminController = require('../controllers/admin.controller');
const imageUploadMw = require('../middlewares/image-uploads-mw');

router.get('/products',adminController.getProducts); //admin/products
   

router.get('/products/new',adminController.getNewProduct);

router.post('/products',imageUploadMw,adminController.createNewProduct);

//update product
router.get('/products/:id',adminController.getUpdateProduct);

router.post('/products/:id',imageUploadMw,adminController.updateProduct);

router.delete('/products/:id',adminController.deleteProduct);

module.exports = router;