const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const { postalIsValid } = require("../util/validation");

const validation = require("../util/validation");

function getSignup(req, res) {
  //..
  res.render("customer/auth/signup"); //widzi go bo sciezka do views byla dodana w app.js
}

async function signup(req, res, next) {
  //data validation, create user
  const userData = req.body;
  console.log(validation.postalIsValid(userData.postal));

  if (
    !validation.userDetailsAreValid(
      userData.email,
      userData.password,
      userData.fullname,
      userData.street,
      userData.postal,
      userData.city
    ) || !validation.emailIsConfirmed(userData.email,userData['confirm-email']) || validation.postalIsValid(userData.postal)===null
  ) {
    console.log("Wywala przy 1 tescie");
    res.redirect("/signup");
    return;
  }

  const user = new User(
    userData.email,
    userData.password,
    userData.fullname,
    userData.street,
    userData.postal,
    userData.city
  );

  const existsAlready = await user.existsAlready();

  try {

    if(existsAlready){
        res.redirect("/signup");
        console.log("User already exists");
        return;
    }

    await user.signup();
  } catch (error) {
    return next(error);
  }

  //zazwyczaj jest redirect w controllerach by uniknac denerwujacego popupa
  res.redirect("/login");
}

function getLogin(req, res) {
  res.render("customer/auth/login");
}

async function login(req, res) {
  const user = new User(req.body.email, req.body.password);

  let existingUser;

  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }

  if (!existingUser) {
    res.redirect("/login");
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );
  if (!passwordIsCorrect) {
    res.redirect("/login");
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}

function logout(req, res) {
  authUtil.destroyUserAuthSesion(req);
  res.redirect("/login");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
