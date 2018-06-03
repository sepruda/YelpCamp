var express       = require("express"),
    app           = express(),
    User          = require("./models/user"),
    seedDB        = require("./seeds"),
    bodyParser    = require("body-parser"),
    passport      = require("passport"),
    mongoose      = require("mongoose"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"), 
    LocalStrategy = require("passport-local")

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "Bjorn and Valde are the cutest boys",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){ //Setup a global middleware function, that passes req.user to currentUser variable
  res.locals.currentUser = req.user;
  next();
});


// Landing page
app.get("/", function(req, res){
  res.render("landing");
});

// ============
//REST ROUTES
// ============

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
  req.user
 // Get all campgrounds from DB
 Campground.find({}, function(err, allCampgrounds){
   if(err){
     console.log(err);
   } else {
    res.render("campgrounds/index", {campgrounds: allCampgrounds});
   }
 });
});

//CREATE - add new campground to DB
app.post("/campgrounds", function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc};
  // Create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated){
    if(err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res) {
   res.render("campgrounds/new");
});

//SHOW - show more info about one campground
app.get("/campgrounds/:id", function(req, res) {
  //find the campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
        //render show template with that campground
        res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

// =====================
// COMMENTS ROUTES
// =====================

// Form to create new comment on particular campground
app.get("/campgrounds/:id/comments/new", isLoggedIn,  function(req, res) {
   Campground.findById(req.params.id, function(err, campground){
      if(err){
        console.log(err);
      } else {
        res.render("comments/new", {campground: campground}); 
     }
   });
});

// Logic to create and save new comment on campground
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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
            campground.comments.push(comment);
            campground.save();
            //redirect to campground show page
            res.redirect("/campgrounds/" + campground._id);
         }
       });
     }
  });
});

// =====================
// AUTH ROUTES
// =====================

// Show register form
app.get("/register", function(req, res) {
   res.render("register"); 
});

// Handle sign up logic
app.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
     if(err){
       console.log(err);
       return res.render("register");
     }
     passport.authenticate("local")(req, res, function(){
       res.redirect("/campgrounds");
     });
   }); 
});

// Show login form
app.get("/login", function(req, res) {
   res.render("login"); 
});

// Handling login logic
app.post("/login", passport.authenticate("local", 
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req, res) {
    
});

// Logout route
app.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/campgrounds");
});

// Logged in middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("YelpCamp server has started");
});