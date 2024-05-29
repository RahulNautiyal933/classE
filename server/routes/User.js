const express = require("express");
const router = express.Router();

const {
  sendOTP,
  signup,
  login,
  changePassword,
} = require("../controllers/Auth");

const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/resetPassword");

const{auth}=require("../middlewares/auth");


//authentication routes

router.post("/login",login);  //tested
router.post("/signup",signup);  //tested
router.post("/sendotp",sendOTP);  //tested
router.post("/changepassword",auth,changePassword);

//password routes

router.post("/resetpassword",resetPassword);  //tested
router.post("/resetpasswordtoken",resetPasswordToken);  //tested

module.exports=router;