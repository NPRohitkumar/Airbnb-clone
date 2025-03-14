const listing = require("../model/listing");
const ExpressError = require("../utils/ExpressError.js");

module.exports.index = async (req, res) => {
    let allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.addListing = (req, res) => {
    res.render("listings/addForm.ejs");
}

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    const singleList = await listing.findById(id).populate({path:"reviews", 
        populate:{path:"author"}
    })
    .populate("owner");
    if (!singleList) {
        next(new ExpressError(404, "page not found"));
    }
    res.render("listings/show.ejs", { singleList });
}

module.exports.createListing = async (req, res, next) => {
    let{path:url , filename} = req.file;
    let newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New listing successfull ADDED");
    res.redirect("/listings");
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const singleList = await listing.findById(id);
    let originalURL = singleList.image.url ;
    originalURL = originalURL.replace("/upload","/upload/h_250,w_250,e_blur:50");
    res.render("listings/updateForm.ejs", { singleList , originalURL });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let singleList = await listing.findByIdAndUpdate(id, req.body.listing);
    if(typeof req.file!== "undefined"){
        let{path:url , filename} = req.file;
        singleList.image = {url , filename};
        await singleList.save();
    }
    req.flash("success","Listing successfull EDITED");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Listing successfull DELETED");
    res.redirect("/listings");
}