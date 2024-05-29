const SubSection=require("../models/SubSection")
const Section=require("../models/Section")
const Course=require("../models/Course");
const { imageUploadToCloudinary } = require("../utils/imageUploader");

exports.createSubSection=async (req,res)=>{
    try {
        
        const{sectionId,title,description,timeDuration}=req.body;

        const video=req.files.videoFile;

        const package={
            sectionId,
            title,
            description,
            timeDuration,
            video
        }

        if(!sectionId || !title || !description || !timeDuration || !video){
            return res.json({
                success:false,
                message:"All fields are required",
            })
        }

        const videoUpload=await imageUploadToCloudinary(video,process.env.FOLDER_NAME,)

        const subSectionDetails=await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:videoUpload.secure_url,
        })


        //update section with subsection id
        await Section.findByIdAndUpdate(sectionId,{$push:{subSection:subSectionDetails._id}},{new:true});


        return res.json({
            success:true,
            message:"Subsection created successfully",
            subSectionDetails,
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