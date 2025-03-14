const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../utils/middleware.js")
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const uploads = multer({storage});

router.route("/")
.get(wrapAsync(listingController.index))  //all listings route
.post(isLoggedIn, uploads.single("listing[image]"), validateListing , wrapAsync(listingController.createListing)); //create listing route


//add listing route
router.get("/new", isLoggedIn, listingController.addListing);

//show listing route
router.get("/:id", wrapAsync(listingController.showListing));

//edit listing route
router.get("/edit/:id", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

//update listing route
router.patch("/update/:id", isLoggedIn, isOwner,uploads.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing));

//delete listing route
router.delete("/delete/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))

module.exports = router;