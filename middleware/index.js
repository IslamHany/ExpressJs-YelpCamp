var Campground = require("../models/campground");
var Comment = require("../models/comment");
//all the middleware goes here
var middlewareObj = {};
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    //is the user logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found");
                res.render("back");
            } else{
                //does the user own the campground ?


                //we used .equals() because foundCampgroun.author.id is an object and you can't compare it with a string
                if(foundCampground.author.id.equals(req.user._id) || (req.user.isAdmin)){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else{
        req.flash("error", "You have to be Logged In first");
        //directs you back wher you came from
        res.redirect("back");
    }
}
middlewareObj.checkCommentOwnership = function(req, res, next){
    //is the user logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Comment not found");
                res.render("back");
            } else{
                //does the user own the coment ?


                //we used .equals() because foundComment.author.id is an object and you can't compare it with a string
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else{
        req.flash("error", "You have to be Logged In first");
        //directs you back wher you came from
        res.redirect("back");
    }
}
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You have to be Logged In first");
    res.redirect("/login");
}
module.exports = middlewareObj;