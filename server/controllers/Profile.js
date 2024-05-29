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