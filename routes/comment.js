var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/Campground");
var Comment = require("../models/Comment");
// ============================
// COMMENT ROUTES
// ===========================
router.get("/new", isloggedIn, function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampGround) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampGround);
            res.render("comment/new", { campground: foundCampGround });
        }
    })
});


router.post("/",function (req, res) {
    Campground.findById(req.params.id, function (err, CampGround) {
        if (err) {
            console.log(err);
            redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username= req.user.username;
                    comment.save();
                    CampGround.comments.push(comment);
                    console.log(CampGround.comments);
                    CampGround.save();
                    console.log("a new comment create");
                    res.redirect("/campgrounds/" + CampGround._id);
                }
            });
        }
    });
});

// edit Features
router.get("/:c_id/edit", isloggedIn, function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, CampGround) {
        Comment.findById(req.params.c_id, function (err, cmt) {
            // console.log(CampGround.comments);
                res.render("comment/edit", {campground: CampGround,comment: cmt });
        })
    })
})

router.put("/:c_id", function (req, res) {
    Comment.findByIdAndUpdate(req.params.c_id,req.body.comment, function (err, editedcmt) {
        if (err) {
            console.log(err);
        } else {
            console.log(editedcmt);
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});
//Delete Feature
router.delete("/:c_id", checkOwnership, function (req, res) {
    Campground.findById(req.params.id,function (err, CampGround) {
        Comment.findByIdAndRemove(req.params.c_id, function(err,d_cmt){
            CampGround.comments.pull(d_cmt);
            CampGround.save();
            res.redirect("/campgrounds/" + req.params.id);
        });   
    })
})



function isloggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkOwnership(req, res, next){
    Campground.findById(req.params.id,function (err, CampGround) {
        Comment.findById(req.params.c_id, function (err, cmt) {
            if (err) {
                console.log(err);
                res.redirect("/campgrounds/" + req.params.id);
            } else {
                if (cmt.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    res.redirect("back");
                }
            }
        })
    })
}
module.exports = router;