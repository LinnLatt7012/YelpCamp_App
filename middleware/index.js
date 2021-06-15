var Campground = require("../models/Campground");
var Comment = require("../models/Comment");
var middlewareObj ={};

middlewareObj.isloggedIn =function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error","You need to login to do that");
    res.redirect("/login");
}

middlewareObj.checkOwnershipCampGround = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampGround) {
            if (err) {
                console.log(err);
                
                res.redirect("/campgrounds/" + req.params.id);
            } else {
                if (foundCampGround.author.id.equals(req.user._id)) {//because ids are not the same data type and for more secure.
                    return next();
                } else {
                    req.flash("error","You don't have permission to do that");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        });
    } else {
        req.flash("error","You need to login to do that");
        res.redirect("/login");
    }

}

middlewareObj.checkOwnershipComment =function(req, res, next){
    if (req.isAuthenticated()) {
    Campground.findById(req.params.id,function (err, CampGround) {
        Comment.findById(req.params.c_id, function (err, cmt) {
            if (err) {
                console.log(err);
                res.redirect("/campgrounds/" + req.params.id);
            } else {
                if (cmt.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        })
    })}else{
        req.flash("error","You need to login to do that");
        res.redirect("/login"); 
    }
}

module.exports = middlewareObj;