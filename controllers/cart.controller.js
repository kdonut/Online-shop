const Product = require('../models/product.model');


function getCart(req,res) {
    res.render('customer/cart/cart');
}


async function addCartItem(req,res,next){

    let product;
    //console.log("add cart item");
    try{
       
       product = await Product.findById(req.params.id);
       // product = await Product.findById(req.body.id);
      
    }catch(error){
        
        next(error);
        return;
    }
   
    const cart = res.locals.cart;
  
    cart.addItem(product);
    req.session.cart = cart;
   // console.log(cart.totalQuantity);
    res.status(201).json({
        message: 'cart updated!',
        newTotalItems : cart.totalQuantity
       
    });
}


module.exports ={ 
    addCartItem : addCartItem,
    getCart : getCart};