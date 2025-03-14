const mongoose = require("mongoose");
const review = require("./review.js")
const user = require("./user.js");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url:String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String ,
    reviews:[{
        type:mongoose.Schema.Types.ObjectId ,
        ref: "review"
    }] ,
    owner: {
        type:mongoose.Schema.Types.ObjectId ,
        ref:"user" 
    }
});

listingSchema.post("findOneAndDelete", async(data)=>{
    if(data.reviews.length){
        await review.deleteMany({_id : { $in : data.reviews}})
    }
})

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;