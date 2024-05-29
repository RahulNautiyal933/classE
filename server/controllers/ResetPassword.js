const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto=require("crypto");

exports.resetPasswordToken = async (req, res) => {
  try {
    const {email} = req.body;

    const user = await User.findOne({email});
    if (!user) {
      return res.json({
        success: false,
        message: "Email doesn't exists",
      });
    }


    const token = crypto.randomUUID();

    const updatedDetails = await User.findOneAndUpdate(
      { email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    const url = `https://localhost:3000/update-password/${token}`

    const mail=await mailSender(
      email,
      "Password reset link",
      `Password reset link: ${url}`
    );

    return res.json({
      succes: true,
      message: "mail sent, please reset the password",
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: "something went wrong",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { confirmPassword, password, token } = req.body;
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "passswords don't match",
      });
    }

    const userDetails = await User.findOne({ token: token });
    if (!userDetails) {
      return res.json({
        succes: false,
        message: "Invalid token",
      });
    }

    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { token },
      { password: hashedPassword },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Password reset successfull",
    });
  } catch (error) {
    res.json({
      succes: false,
      message: "Unable to reset password",
    });
  }
};
