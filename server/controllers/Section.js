const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");

exports.createSection = async (req, res) => {
  try {
    //fetch data from body
    const { sectionName, courseId } = req.body;
    //validation
    if (!sectionName || !courseId) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }
    //insert objectId in course
    const newSection = await Section.create({ sectionName });
    console.log(newSection);
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      success: false,
      message: "Unable to create section ,please try again",
    });
  }
};

//update section
exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId } = req.body;

    if (!sectionName || !sectionId) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    const sectionDetails = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Details updated successfully",
      sectionDetails,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: "Unable to update section details",
    });
  }
};

//delete section
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId,courseId } = req.body;
    await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})


    const section = await Section.findById(sectionId);
    if(!section){
      return res.status(400).json({
        success:false,
        message:"No section found",
      })
    }
    await SubSection.deleteMany({_id: {$in: section.subSection}});
    await Section.findByIdAndDelete(sectionId);
    const course=await Course.findById(courseId).populate({
      path:"courseContent",
      populate:{
        path:"subSection"
      }
    })
    .exec();


    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      data:course,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
