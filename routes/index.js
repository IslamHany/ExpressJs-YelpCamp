var express = require("express");
var router = express.Router();
var passport = require("passport");
var Campground = require("../models/campground");
var User = require("../models/user");
router.get("/", function(req, res){
    res.render("landing");
});
//=============
//AUTH ROUTES
//=============
//show register
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    if(req.body.admin == "secretcode123"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            res.redirect("/register");
        } else{
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp " + user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

//SHOW login form
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds", 
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: 'Welcome Successfully Loged In!'
}), function(req, res){
});

//Logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

//USER route
router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "User not found");
            res.redirect("/");
        } else{
            Campground.find().where("author.id").equals(foundUser._id).exec(function(err, foundCampground){
                if(err){
                    req.flash("error", "Something went wrong");
                    return res.redirect("back");
                }
                res.render("users/show", {user: foundUser, campgrounds: foundCampground});
            });
        }
    });
});

module.exports = router;