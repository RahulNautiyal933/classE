const Profile=require("../models/Profile");
const User=require("../models/User");

//create profile
exports.updateProfile=async(req,res)=>{
    try {
        //get details
        const {gender,dateOfBirth="",about="",contactNumber}=req.body;
        
        const id=req.user.id;

        //validation
        if(!contactNumber || !gender || !id){
            return res.json({
                success:false,
                message:"All fields are required",
            })
        }

        //get User id
        const userDetails=await User.findById(id);

        // fetch profile from User
        const profileId=await userDetails.additionalDetails;
        const profileDetails=await Profile.findById(profileId);

        // update the details
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.gender=gender;
        profileDetails.contactNumber=contactNumber;
        profileDetails.about=about;

        await profileDetails.save();

        //return response
        return res.json({
            success:true,
            message:"Profile updated successfully",
            profileDetails,
        })



    } catch (error) {
        console.log(error.message);
        return res.json({
            success:false,
            message:"Profile could not be updated,try again",
        })
    }
}

// exports.updateProfilePic=async(req,res)=>{

// }

//deleteAccount
exports.deleteAccount=async (req,res)=>{
    try {
        const id=req.user.id;
        const userDetails=await User.findById(id);
        
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"user id not found",
            })
        }

        // user me jo additional details wala section hai pehle wahan se profile delete karo using profile id
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

        await User.findByIdAndDelete(id);

        return res.json({
            success:true,
            message:"User deleted successfully",
        })

        // TODO: unenroll user from all enrolled courses
        // TODO: schedule the delete action
        // what is a chroneJob ??

    } catch (error) {
        res.json({
            success:false,
            message:"Unable to delete account ,please try again",
        })
    }
}

//get all details of the user
exports.getAllUserDetails=async(req,res)=>{
    try {
        const id=req.user.id;
        
        const userDetails=await User.findById(id).populate("additionalDetails").exec();

        return res.json({
            success:true,
            message:"User data fetched successfully",
            userDetails
        })

    } catch (error) {
        res.json({
            success:false,
            message:error.message,
        })
    }
}

exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      let userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path: "courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          },
        })
        .exec()
      userDetails = userDetails.toObject()
      var SubsectionLength = 0
      for (var i = 0; i < userDetails.courses.length; i++) {
        let totalDurationInSeconds = 0
        SubsectionLength = 0
        for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
          totalDurationInSeconds += userDetails.courses[i].courseContent[
            j
          ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
          userDetails.courses[i].totalDuration = convertSecondsToDuration(
            totalDurationInSeconds
          )
          SubsectionLength +=
            userDetails.courses[i].courseContent[j].subSection.length
        }
        let courseProgressCount = await CourseProgress.findOne({
          courseID: userDetails.courses[i]._id,
          userId: userId,
        })
        courseProgressCount = courseProgressCount?.completedVideos.length
        if (SubsectionLength === 0) {
          userDetails.courses[i].progressPercentage = 100
        } else {
          // To make it up to 2 decimal point
          const multiplier = Math.pow(10, 2)
          userDetails.courses[i].progressPercentage =
            Math.round(
              (courseProgressCount / SubsectionLength) * 100 * multiplier
            ) / multiplier
        }
      }
  
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }