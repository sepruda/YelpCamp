var express         = require("express"),
    app             = express(),
    User            = require("./models/user"),
    flash           = require("connect-flash"),
    seedDB          = require("./seeds"),
    bodyParser      = require("body-parser"),
    passport        = require("passport"),
    mongoose        = require("mongoose"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"), 
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override")

// Requiring routes
var commentRoutes     = require("./routes/comments"),
    campgroundRoutes  = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index")

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //Seed the database

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
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Use Routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("YelpCamp server has started");
});