var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var localStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var User = require("./models/user");
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
var moment = require("moment");
const PORT = process.env.PORT || 3000;
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";

//We are making an environment database variable so we do not mess our data while testing on the local host
//mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
//process.env.DATABASEURL for heroku = mongodb+srv://islam:2532328050@cluster0-wbqvp.mongodb.net/test?retryWrites=true&w=majority
mongoose.connect(url, {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//PASSPORT config
app.use(require("express-session")({
    secret: "Any thing can be typed here!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to add req.user object to all the routes without manually doing it
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.moment = moment;
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(PORT, function(){
    console.log("YelpCamp has started!!!");
});