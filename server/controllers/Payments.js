const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const mongoose = require("mongoose");

//capture payment and initiate the order
exports.capturePayment = async (req, res) => {
  const courseId = req.body;
  const userId = req.user.id;

  if (!courseId) {
    return res.json({
      success: false,
      message: "PLease provide valid course ID",
    });
  }

  let course;
  try {
    course = await Course.findById(courseId);
    if (!course) {
      return res.json({
        success: false,
        message: "Could not find the course",
      });
    }

    const uid = new mongoose.Schema.Types.ObjectId(userId);

    if (course.studentEnrolled.includes(uid)) {
      return res.json({
        success: false,
        message: "Student is already enrolled",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }

  const amount = course.price;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
      courseId: courseId,
      userId,
    },
  };

  try {
    //initiate the payment using razorpay
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);

    return res.json({
      success: true,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.orderId,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: "Couldn't initiate payment",
    });
  }
};

exports.verifySignature = async (req, res) => {
  const webhookSecret = "123456789";

  const signature = req.headers("x-razorpay-signature");

  // converting webhook to encrypted form
  const shasum = crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature == digest) {
    console.log("Payment is authorized");

    const { courseId, userId } = req.body.payload.payment.entity.notes;

    try {
      const enrolledCourse = await Course.findOneAndUpdate(
        {_id:courseId},
        { $push: { studentEnrolled: userId } },
        { new: true }
      );


      if(!enrolledCourse){
        return res.json({
            success:false,
            message:"Course not found",
        })
      }

      console.log(enrolledCourse);

      const enrolledStudent=await User.findByIdAndUpdate({_id:userId},{$push:{courses:courseId}},{new:true})

      console.log(enrolledStudent);

      // welcome email for the students
      const emailResponse=await mailSender(enrolledStudent.email,"Congratulations from StudyNotion","Congratulations, you have onboarded the course");

      console.log(emailResponse);

      return res.json({
        success:true,
        message:"Signature verified successfully",
      })

    } catch (error) {
        console.log(error.message);
        return res.json({
            success:false,
            message:"Student could not be enrolled, try again",
        })
    }
  }
  else{
    return res.json({
        success:false,
        message:"Invalid request",
    })
  }
};
