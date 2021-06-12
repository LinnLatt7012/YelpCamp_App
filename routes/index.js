var express = require("express");
var router = express.Router();

var User = require("../models/User"),
    passport = require("passport");

router.get("/", function (req, res) {
    res.render("landing");
});

router.get("/register", function (req, res) {
    res.render("Auth/register");
});
router.post("/register", function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    User.register(new User({ username: username }), password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('Auth/register');
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/campgrounds");
            })
        }
    })
});

//Show Login form
router.get("/login", function (req, res) {
    res.render("Auth/login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {
});

//Logout 
router.get("/logout", function (req, res) {
    req.logOut();
    res.redirect('/campgrounds');
});

function isloggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
module.exports = router;