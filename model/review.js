// const { required } = require("joi");
const mongoose= require("mongoose");

const reviewSchema = new mongoose.Schema({
    rating:{
        type:Number ,
        min:1,
        max:5,
        required:true
    } , 
    comment : {
        type: String , 
        required:true
    },
    createdAt : {
        type:Date ,
        default : Date.now()
    } ,
    author : {
        type: mongoose.Schema.Types.ObjectId ,
        ref:"user"
    }
});

const review = mongoose.model("review" , reviewSchema);

module.exports = review;