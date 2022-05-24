const express = require('express');

const router = express.Router();

router.get('/products',function(req,res){
    res.render('customer/products/all-products');
   // res.render('/login');
})



module.exports = router;