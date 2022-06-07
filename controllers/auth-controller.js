const User = require("../models/user.model");
const authUtil = require("../util/authentication");
//const { postalIsValid } = require("../util/validation");

const sessionFlash = require("../util/session-flash");

const validation = require("../util/validation");

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

    //if no session set default data

    if(!sessionData){
        sessionData = {
            email : '',
            password:'',
            confirmEmail :'',
            password : '',
            fullname : '',
            street: '',
            postal:'',
            city: ''
        };


    }

  res.render("customer/auth/signup",{inputData : sessionData}); //widzi go bo sciezka do views byla dodana w app.js
}

async function signup(req, res, next) {
  //data validation, create user
  const userData = req.body;

  const enteredData = {
    email: userData.email,
    confirmEmail: userData['confirm-email'],
    password: userData.password,
    fullname: userData.fullname,
    street: userData.street,
    postal: userData.postal,
    city: userData.city,
  };

  //console.log(validation.postalIsValid(userData.postal));

  if (
    !validation.userDetailsAreValid(
      userData.email,
      userData.password,
      userData.fullname,
      userData.street,
      userData.postal,
      userData.city
    ) ||
    !validation.emailIsConfirmed(userData.email, userData["confirm-email"]) ||
    validation.postalIsValid(userData.postal) === null
  ) {
   
    sessionFlash.flashSessionData(
      req,
      {
        errorMessage:
          "Please check your imput, password must be at least 6 char. long, postal shoud be in format xx-xxx",
        ...enteredData, //ten zapis dodaje obiekt enteredData do tworzonego juz z errormessage
      },
      function () {
        res.redirect("/signup");
      }
    );

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
    if (existsAlready) {
      sessionFlash.flashSessionData(
        req,
        {
          errorMessage: "User already exists",
          ...enteredData, //ten zapis dodaje obiekt enteredData do tworzonego juz z errormessage
        },
        function () {
          res.redirect("/signup");
        }
      );
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
    let sessionData = sessionFlash.getSessionData(req);

    //if no session set default data

    if(!sessionData){
        sessionData = {
            email : '',
            password:'',
        };
    }

  res.render("customer/auth/login",{inputData : sessionData});
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

  const sessionErrorData = {
    errorMessage:
      "Invalid credentials - please double check your email and password",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.flashSessionData(req, sessionErrorData, function () {
      res.redirect("/login");
    });

    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );
  if (!passwordIsCorrect) {
    sessionFlash.flashSessionData(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
      //console.log(existingUser);
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
  logout: logout
};
