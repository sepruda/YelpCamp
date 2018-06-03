var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Comments New - Form to create new comment on particular campground
router.get("/new", isLoggedIn,  function(req, res) {
   Campground.findById(req.params.id, function(err, campground){
      if(err){
        console.log(err);
      } else {
        res.render("comments/new", {campground: campground}); 
     }
   });
});

// Comments Create - Logic to create and save new comment on campground
router.post("/", isLoggedIn, function(req, res){
  //Lookup campground using ID
  Campground.findById(req.params.id, function(err, campground) {
     if(err){
       console.log(err);
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
            res.redirect("/campgrounds/" + campground._id);
         }
       });
     }
  });
});

// Logged in middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}


module.exports = router;