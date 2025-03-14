const express = require("express");
const router = express.Router();
const user = require("../model/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {isLoggedIn , saveRedirectUrl} = require("../utils/middleware.js");
const userController = require("../controllers/user.js");

router.route("/signup")
.get( userController.renderSignUpForm)  //render signUp form
.post(wrapAsync(userController.signUp));  //signup

router.route("/login")
.get(userController.renderLoginForm)  //render login form
.post(saveRedirectUrl , passport.authenticate (  //login
    "local" , { failureRedirect : "/login" , failureFlash : true}
) , wrapAsync (userController.Login));

router.get("/logout",isLoggedIn ,userController.logout);

module.exports = router;