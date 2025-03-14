const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
// const user = require("../model/user.js");
const { isLoggedIn, validateReview , isReviewAuthor} = require("../utils/middleware.js");
const reviewController = require("../controllers/review.js");


//create review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//delete reviews route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;