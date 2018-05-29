var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
  {name: "Salmon Creek", image: "https://pixabay.com/get/e833b3092cf5033ed1584d05fb1d4e97e07ee3d21cac104497f7c47eaeeab1bd_340.jpg"},
  {name: "Granite Hill", image: "https://farm8.staticflickr.com/7457/9586944536_9c61259490.jpg"},
  {name: "Mountain Goat's rest", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104497f7c47fa3efb1bc_340.jpg"},
];

app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name: name, image: image};
  campgrounds.push(newCampground);
  res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
   res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("YelpCamp server has started");
});