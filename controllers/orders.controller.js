const Order = require("../models/order.model");
const User = require("../models/user.model");


function getOrders(req,res) {

    res.render('customer/orders/all-orders');
}

async function addOrder(req, res,next) {
    const cart = res.locals.cart;
    let userDocument;
    let order;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  try {
    order = new Order(cart,userDocument);
    await order.save();

  } catch (error) {
    return next(error);
    return;
  }

    req.session.cart = null;
    res.redirect('/orders');
}

module.exports = {
  addOrder: addOrder,
  getOrders : getOrders
};
