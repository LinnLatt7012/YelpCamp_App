var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride  = require("method-override"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/Campground"),
    Comment = require("./models/Comment"),
    User = require("./models/User"),
    seedDB = require("./seeds");

var commentRoutes       = require("./routes/comment"),
    campgroundRoutes    = require("./routes/campground"),
    indexRoutes         = require("./routes/index");


mongoose.connect('mongodb://localhost:27017/Yelp_app_v7', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
// seedDB();

//Passport configuration
app.use(require("express-session")({
    secret: "BTS is Best Group in my eyes",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser= req.user;
    next();
});

// ========================
// Routes
// =========================
app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);



// ========================
// Port listen
// =========================
app.listen(8080, function () {
    console.log("sever-started");
})