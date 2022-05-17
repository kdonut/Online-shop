const User = require("../models/user.model");

function getSignup(req, res) {
  //..
  res.render("customer/auth/signup"); //widzi go bo sciezka do views byla dodana w app.js
}

async function signup(req, res) {
  //data validation, create user
  const userData = req.body;
  const user = new User(
    userData.email,
    userData.password,
    userData.fullname,
    userData.street,
    userData.postal,
    userData.city
  );

  await user.signup();
  //zazwyczaj jest redirect w controllerach by uniknac denerwujacego popupa
  res.redirect('/login');
}

function getLogin(req, res) {
  res.render("customer/auth/login");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
};
