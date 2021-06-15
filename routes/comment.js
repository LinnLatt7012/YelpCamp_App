var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/Campground");
var Comment = require("../models/Comment");
var middlewareObj = require("../middleware");
// ============================
// COMMENT ROUTES
// ===========================
router.get("/new", middlewareObj.isloggedIn, function (req, res) {
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
                    //console.log(CampGround.comments);
                    CampGround.save();
                    //console.log("a new comment create");
                    res.redirect("/campgrounds/" + CampGround._id);
                }
            });
        }
    });
});

// edit Features
router.get("/:c_id/edit", middlewareObj.checkOwnershipComment, function (req, res) {
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
router.delete("/:c_id", middlewareObj.checkOwnershipComment, function (req, res) {
    Campground.findById(req.params.id,function (err, CampGround) {
        Comment.findByIdAndRemove(req.params.c_id, function(err,d_cmt){
            CampGround.comments.pull(d_cmt);
            CampGround.save();
            res.redirect("/campgrounds/" + req.params.id);
        });   
    })
})


module.exports = router;