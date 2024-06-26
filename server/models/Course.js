const mongoose=require("mongoose");
const tag=require("./Category");
const User=require("./User");

const courseSchema=new mongoose.Schema({
    courseName:{
        type:String,
    },
    courseDescription:{
        type:String,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    whatYouWillLearn:{
        type:String
    },
    courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section"
    }],
    ratingAndReviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview",
    }],
    price:{
        type:String,
        required:true,
    },
    thumbnail:{
        type:String,
    },
    tag:{
        type:[String],
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    studentEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    }],
    instructions:{
        type:[String],
    },
    status:{
        type:String,
        enum:["Draft","Published"],
    }
})

module.exports=mongoose.model("Course",courseSchema);
