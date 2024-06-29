const Course = require("../models/Course");
const User = require("../models/User");
const Category = require("../models/Category");
const { imageUploadToCloudinary } = require("../utils/imageUploader");
const SubSection = require("../models/SubSection");
require("dotenv").config();

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    //fetch data
    const { courseName, courseDescription, price, whatYouWillLearn, category } =
      req.body;

    //get thumbnails
    const thumbnail = req.files.thumbnailImage;

    //validation
    if (
      !courseDescription ||
      !courseName ||
      !price ||
      !whatYouWillLearn ||
      !category ||
      !thumbnail
    ) {
      return res.json({
        success: false,
        message: "please fill all the required fields",
      });
    }

    //check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);

    if (!instructorDetails) {
      return res.json({
        success: false,
        message: "Instructor details not found",
      });
    }

    //check given category is valid or not
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.json({
        success: false,
        message: "Invalid category",
      });
    }
    console.log(categoryDetails)

    // upload image to cloudinary
    const thumbnailImage = await imageUploadToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // create an entry for new course
    const newCourse= await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      price,
      category: categoryDetails._id,
      whatYouWillLearn,
      thumbnail: thumbnailImage.secure_url,
    });

    //add new course to the instructor list
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    )

    return res.json({
      success: true,
      message: "Course created successfully",
      data:newCourse,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Failed to create course, please try again",
      error: error.message,
    });
  }
};

//get all courses
exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find({}).populate("category").populate({path:"courseContent",
      populate:{
        path:"subSection"
      }});

    return res.json({
      success: true,
      message: "All courses",
      allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get courseDetails
exports.getCourseDetails = async (req, res) => {
  //get courseId
  try {
    const { courseId } = req.body;
    //find course Details
    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({path:"courseContent",
      populate:{
        path:"subSection"
      }})
      .exec();
      
    if (!courseDetails) {
      return res.json({
        success: false,
        message: `Course details not found for ${courseId}`,
      });
    }

    return res.json({
      success: true,
      message: "Course details fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: "Could not fetch details ,try again",
    });
  }
};
