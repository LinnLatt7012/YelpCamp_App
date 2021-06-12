var express = require("express");
var router = express.Router();
var Campground = require("../models/Campground");
var Comment = require("../models/Comment");

router.get('/',function (req, res) {
    Campground.find({}, function (err, camp) {
        if (err) {
            console.log("OH NO, ERROR!  ");
            console.log(err);
        } else {
            console.log("All THE CAMPS......");
            res.render("campground/index", { campgrounds: camp});
        }
    })
});
router.get("/new",isloggedIn , function (req, res) {
    res.render("campground/new");
});
router.post('/',function (req, res) {
    var c_name = req.body.c_name;
    var image = req.body.image;
    var desc = req.body.description;
    var n_campground = { name: c_name, image: image, description: desc };
    Campground.create(n_campground, function (err, camp) {
        if (err) {
            console.log("You got error at saving");
        } else {
            camp.author.id = req.user._id;
            camp.author.username = req.user.username;
            camp.save();
            console.log("We save a campp at Yelp_router db");
            console.log(camp);
        }
    });
    res.redirect("/campgrounds");
});


//show- show more info about one campground.
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampGround) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampGround);
            res.render("campground/show", { campground: foundCampGround });
        }
    })
});

//Edit Features
router.get("/:id/edit",isloggedIn,function(req,res){
    Campground.findById(req.params.id,function (err, foundCampGround) {
        if (err) {
            console.log(err);
            redirect("/campgrounds");
        } else {
            if(foundCampGround.author.username == req.user.username){
                res.render("campground/edit", {campground: foundCampGround});
            }else{
                res.send("malicicous action");
            }
        }
    })
})
router.put("/:id", function(req, res){
    var c_name = req.body.c_name;
    var image = req.body.image;
    var desc = req.body.description;
    var u_campground = { name: c_name, image: image, description: desc };
    Campground.findByIdAndUpdate(req.params.id,u_campground ,function(err, editedblog){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});
//Delete Features
router.delete("/:id",isloggedIn, function(req, res){
    Campground.findById(req.params.id,function(err,  foundCampGround){
        if (err) {
            console.log(err);
        } else {
            if(foundCampGround.author.username == req.user.username){
            Campground.remove(foundCampGround,function(err,dcg){
                if(err){
                    console.log(err);
                }else{
                    console.log(dcg);
                }
            });
               res.redirect("/campgrounds");
            }else{
                res.send("/campgrounds");
            }
            
        }
    })
});
function isloggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;