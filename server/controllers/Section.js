const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection=require("../models/SubSection");

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
    const newSection = await Section.create({sectionName});
    console.log(newSection);
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        }
      },
      { new: true }
    )
    // .populate(courseContent)
    // .populate(SubSection).exec();

    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourseDetails,
    });

} catch (error) {
    console.log(error.message);
    return res.status(400).json({
        success:false,
        message:"Unable to create section ,please try again",
    })
  }
};



//update section
exports.updateSection=async (req,res)=>{
    try {
        const {sectionName,sectionId}=req.body;


        if(!sectionName || !sectionId){
            return res.json({
                success:false,
                message:"All fields are required",
            })
        }

        const sectionDetails=await Section.findByIdAndUpdate(sectionId,
                                                            {sectionName},
                                                            {new:true});

        return res.json({
            success:true,
            message:"Details updated successfully",
            sectionDetails,
        })

    } catch (error) {
        console.log(error.message);
        return res.json({
            success:false,
            message:"Unable to update section details",
        })
    }
}


//delete section
exports.deleteSection=async (req,res)=>{
    try {
        const {sectionId}=req.params;

    await Section.findByIdAndDelete(sectionId);

    return res.json({
        success:true,
        message:"Section deleted successfully",
    })
    } catch (error) {
        return res.json({
            success:false,
            message:error.message,
        })
        
    }
}