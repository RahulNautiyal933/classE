const SubSection=require("../models/SubSection")
const Section=require("../models/Section")
const Course=require("../models/Course");
const { imageUploadToCloudinary } = require("../utils/imageUploader");

exports.createSubSection=async (req,res)=>{
    try {
        
        const{sectionId,title,description}=req.body;
        const video=req.files.videoFile;

        if(!sectionId || !title || !description || !video){
            return res.status(404).json({
                success:false,
                message:"All fields are required",
            })
        }
        console.log(video)

        const videoUpload=await imageUploadToCloudinary(video,process.env.FOLDER_NAME,)

        const subSectionDetails=await SubSection.create({
            title:title,
            timeDuration:`${videoUpload.duration}`,
            description:description,
            videoUrl:videoUpload.secure_url,
        })


        //update section with subsection id
        const updatedSection = await Section.findByIdAndUpdate(sectionId,{$push:{subSection:subSectionDetails._id}},{new:true}).populate("subSection")


        return res.json({
            success:true,
            message:"Subsection created successfully",
            updatedSection,
        })

    } catch (error) {
        return res.json({
            success:false,
            message:error.message,
        })
    }
}

//update subsection
exports.updateSubSection=async (req,res)=>{

}

//delete subsection
exports.deleteSubSection=async (req,res)=>{

}