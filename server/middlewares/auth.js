const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User");

//auth
exports.auth=async (req,res,next)=>{
    try{
        //extracting token
        const token=req.cookies.token
                    || req.body.token
                    || req.header("Authorisation").replace("Bearer ","");
    
        //if token is missing return a message
        if(!token){
            res.status(401).json({
                success:false,
                message:"Token not found",
            })
        }

        //verify the token
        try {
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"token is invalid",
            })
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token , please try again",
        })
    }
}

// isStudent
exports.isStudent=async(req,res,next)=>{
    try {
        if(req.user.accountType!="Student"){
            return res.status(401).json({
                success:false,
                message:"this is a protected route for students only",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"user role cannot be verified, please try again",
        })
    }
}


// isInstructor
exports.isInstructor=async(req,res,next)=>{
    try {
        if(req.user.accountType!="Instructor"){
            return res.status(401).json({
                success:false,
                message:"this is a protected route for Instructor only",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"user role cannot be verified, please try again",
        })
    }
}

//isAdmin
exports.isAdmin=async(req,res,next)=>{
    try {
        if(req.user.accountType!="Admin"){
            return res.status(401).json({
                success:false,
                message:"this is a protected route for Admin only",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"user role cannot be verified, please try again",
        })
    }
}
