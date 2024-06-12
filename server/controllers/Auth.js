const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const Profile=require("../models/Profile");
const mailSender=require("../utils/mailSender");
const {passwordUpdated}=require("../mail/templates/passwordUpdate");
require("dotenv").config();

//send OTP
//tested
exports.sendOTP = async (req, res) => {
  try {
    const {email} = req.body;
    
    const checkUserPresent =await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("Otp generated", otp);

    let result = await OTP.findOne({otp});

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    }

    const otpPayload = { email, otp };
    const otpBody=await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
        success:true,
        message:"OTP sent successfully",
    })
} catch (error) {
    console.log(error);
    res.status(500).json({
        success:false,
        message:error.message,
    })
}
}

//signup
// tested
exports.signup=async (req,res)=>{
    try {

    const{
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
    }=req.body;

    //checking for required fields
    if(!firstName || !email|| !lastName || !password || !confirmPassword || !otp){
        return res.status(401).json({
            success:false,
            message:"Enter the required fields",
        })
    }

    //matching the 2 entered password
    if(password!==confirmPassword){
        res.status(403).json({
            success:false,
            message:"Password and confirmPassword don't match"
        })
    }

    //checking if user already exists
    const userPresent=await User.findOne({email})
    if(userPresent){
        return res.status(400).json({
            success:false,
            message:"User already exists",
        })
    }

    //find most recent OTP
    let recentOtp=await OTP.findOne({email}).sort({createdAt:-1}).limit(1);

    console.log(recentOtp);
    console.log("Entered otp",otp);

    if(!recentOtp){
        return res.status(400).json({
            success:false,
            message:"Otp not found",
        })
    }
    else if(recentOtp.otp!=otp){
        return res.status(400).json({
            success:false,
            message:"Invalid OTP !!",
        })
    }

    //password hashing
    const hashedPassword=await bcrypt.hash(password,10);

    const profileDetails=await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null,
    });

    //user created
    const user=await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password:hashedPassword,
        accountType,
        additionalDetails:profileDetails._id,
        image:`https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`
    })

    return res.status(200).json({
        success:true,
        message:"User is registerd successfully",
        user,
    })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered, please try again",
        })
    }
}

//login
// tested
exports.login=async (req,res)=>{
    try {
        //data fetch from body
        const{email,password}=req.body;

        //validate data
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }

        //existing user or not
        const user=await User.findOne({email}).populate("additionalDetails");

        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered,please signup first",
            });
        }

        //generate JWT token
        const payload={
            email:user.email,
            id:user._id,
            accountType:user.accountType,
        }
        if(await bcrypt.compare(password,user.password)){
            const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"2d"});

        user.token=token;
        user.password=null;

        //create cookie and response
        const options={
            expiresIn:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true,
        }
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"logged in successfully",
        })
    }
    else{
        res.status(401).json({
            success:false,
            message:"Passowrd Incorrect",
        })
    }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Login failure,please try again",
        })
    }
}

//change password
exports.changePassword = async (req, res) => {
    try {
      const userDetails = await User.findById(req.user.id)
 
      const { oldPassword, newPassword } = req.body
  

      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        userDetails.password
      )
      if (!isPasswordMatch) {
        return res
          .status(401)
          .json({ success: false, message: "The password is incorrect" })
      }
  

      const encryptedPassword = await bcrypt.hash(newPassword, 10)
      const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
      )
  
      // Send notification email
      try {
        const emailResponse = await mailSender(
          updatedUserDetails.email,
          "Password for your account has been updated",
          passwordUpdated(
            updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
          )
        )
      } catch (error) {
        console.error("Error occurred while sending email:", error)
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error: error.message,
        })
      }
  
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" })
    } catch (error) {
      console.error("Error occurred while updating password:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      })
    }
  }