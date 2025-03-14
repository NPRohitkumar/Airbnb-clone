const listing = require("../model/listing");
const review = require("../model/review");

const ExpressError = require("./ExpressError.js")
const {listingSchema , reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Please login to access the page");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let singleList = await listing.findById(id);
    if(!singleList.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you cannot access this page");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// validate listing through joi
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(" , ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

//validate review through joi
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(" , ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let { id , reviewId } = req.params;
    let currReview = await review.findById(reviewId).populate("author");
    if(!currReview.author._id.equals(req.user._id)){
        req.flash("error","you cannot delete the review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}