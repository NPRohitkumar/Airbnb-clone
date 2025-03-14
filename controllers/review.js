const listing = require("../model/listing.js");
const review = require("../model/review.js");

module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    let curListing = await listing.findById(id);
    let clientReview = new review(req.body.review);
    clientReview.author = req.user._id;
    curListing.reviews.push(clientReview);
    await clientReview.save();
    await curListing.save();
    req.flash("success", "Review successfull ADDED");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash("success", "Review successfull DELETED");
    res.redirect(`/listings/${id}`);
}