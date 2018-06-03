var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment")

//Starting data
var data = [
  { name: "Cloud's Rest", 
    image: "https://res.cloudinary.com/dfb3rasor/image/upload/v1528025876/camp-2587926_960_720.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  { name: "Rock mountain", 
    image: "https://res.cloudinary.com/dfb3rasor/image/upload/v1528025848/e83db50a21f4073ed1584d05fb1d4e97e07ee3d21cac104497f8c178a2e9b4ba_340.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  { name: "Camp lakeview", 
    image: "https://res.cloudinary.com/dfb3rasor/image/upload/v1528025652/pixabay-1208201.png",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
]

function seedDB(){
  //Remove all campgrounds
  Campground.remove({}, function(err){
    if(err){
      console.log(err);
    } else {
    console.log("Removed all campgrounds");
    }
    //Add a few campgrounds
    data.forEach(function(seed){
      Campground.create(seed, function(err, campground){
       if(err) {
         console.log(err);
       } else {
         console.log("Added a campground");
         //Create a comment
         Comment.create(
           {
             text: "This place is great, but I wish there was WiFi", 
             author: "Homer"
           }, function(err, comment){
             if(err){
               console.log(err);
             } else {
             campground.comments.push(comment);
             campground.save();
             console.log("Created new comment");
             }
           });
       }
      });
    });
  });  
};

module.exports = seedDB;
