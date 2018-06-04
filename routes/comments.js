var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Comments New - Form to create new comment on particular campground
router.get("/new", middleware.isLoggedIn,  function(req, res) {
   Campground.findById(req.params.id, function(err, campground){
      if(err){
        console.log(err);
      } else {
        res.render("comments/new", {campground: campground}); 
     }
   });
});

// Comments Create - Logic to create and save new comment on campground
router.post("/", middleware.isLoggedIn, function(req, res){
  //Lookup campground using ID
  Campground.findById(req.params.id, function(err, campground) {
     if(err){
       console.log(err);
       req.flash("error", "Something went wrong");
       res.redirect("/campgrounds");
      } else {
        //Create new comment
        Comment.create(req.body.comment, function(err, comment){
          if(err){
           console.log(err);
          } else {
            //Connect new comment to campground
            // Add username and id to comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            // Save comment
            comment.save();
            // Add comment to campground and save
            campground.comments.push(comment);
            campground.save();
            //redirect to campground show page
            req.flash("success", "Comment created");
            res.redirect("/campgrounds/" + campground._id);
         }
       });
     }
  });
});

// Comment Edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment) {
      if(err){
        req.flash("error", "Something went wrong");
        res.redirect("back");
      } else {
        req.flash("success", "Comment updated");
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
      }
  });
});

//Comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      req.flash("error", "Something went wrong");
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//Comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("back") 
    }
  });
});

module.exports = router;