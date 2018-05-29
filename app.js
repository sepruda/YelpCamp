var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  var campgrounds = [
    {name: "Salmon Creek", image: "https://pixabay.com/get/e833b3092cf5033ed1584d05fb1d4e97e07ee3d21cac104497f7c47eaeeab1bd_340.jpg"},
    {name: "Granite Hill", image: "https://farm8.staticflickr.com/7457/9586944536_9c61259490.jpg"},
    {name: "Mountain Goat's rest", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104497f7c47fa3efb1bc_340.jpg"},
  ];
  res.render("campgrounds", {campgrounds: campgrounds});
});

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("YelpCamp server has started");
});