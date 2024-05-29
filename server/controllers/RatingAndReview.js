const RatingAndReview=require("../models/RatingAndReview");
const Course=require("../models/Course");
const { default: mongoose } = require("mongoose");

exports.createRating=async(req,res)=>{
    try {
        //get courseId, rating, review,userId
        const userId=req.user.id;
        const {rating,review,courseId}=req.body;
        //validate the user i.e., whether already enrolled or not
        const courseDetails=await Course.findById(courseId);
        const enrolled=await courseDetails.studentEnrolled.findById(userId);

        if(!enrolled){
            return res.json({
                success:false,
                message:"Student is not enrolled in the course",
            })
        }



        //check if previous rating is done        
        const alreadyReviewed=await RatingAndReview.findOne({
            course:courseId,
            user:userId
        });

        if(alreadyReviewed){
            return res.json({
                success:false,
                message:"You have already rated the course",
            })
        }



        //create rating and review
        const ratingReview=await RatingAndReview.create({
            rating,review,course:courseId,user:userId,
        })

        //insert review inside course
        const updatedCourseDetails=await Course.findByIdAndUpdate({courseId},
                                                            {$push:{
                                                                ratingAndReviews:ratingReview._id,
                                                            }},{new:true});
        console.log(updatedCourseDetails)
        
        //return response 
        return res.json({
            success:true,
            message:"rating review has been submitted successfully",
            ratingReview,
        })                    
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Could not submit the review, please try again later",
            errror:error.message,
        })
    }
}

exports.averageRating=async (req,res)=>{
    try {
        //get course id
        const courseId=req.body.courseId;

        //calculate average rating
        const result=await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Schema.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"rating"},
                }
            }
        ])

        //return rating
        if(result.length>0){
            return res.json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }

        return res.json({
            success:true,
            message:"Zero ratings for this course",
            averageRating:0,
        })

    } catch (error) {
        return res.json({
            success:false,
            message:"Average rating not created",
        })   
    }
}


//getAllRatingAndReviews

exports.getAllReviews=async (req,res)=>{
    try {
        const allReviews=await RatingAndReview.find({})
                                        .sort({rating:"desc"})
                                        .populate({
                                            path:"user",
                                            select:"firstName lastName email image"
                                        })
                                        .populate({
                                            path:"course",
                                            select:"courseName",
                                        })
                                        .exec();

    return res.json({
        success:true,
        message:"All reviews fetched successfully",
        allReviews,
    })
    } catch (error) {
        return res.json({
            success:false,
            message:error.message,
        })
    }
}