const express = require("express");
const router = express.Router();

const {
  createCourse,
  showAllCourses,
  getCourseDetails,
} = require("../controllers/Course");

const {
  showAllCategory,
  createNewCategory,
  categoryPageDetails,
} = require("../controllers/Category");

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
  } = require("../controllers/SubSection")

  const {
    createRating,
    averageRating,
    getAllReviews,
  } = require("../controllers/RatingAndReview")

  const{auth,isAdmin,isInstructor,isStudent}=require("../middlewares/auth");

//router for course(can be visited by only instructor)
router.post("/createCourse", auth, isInstructor, createCourse)  //tested
router.get("/getAllCourses", showAllCourses)  //tested
router.post("/getCourseDetails", getCourseDetails)  //tested
router.post("/addSection", auth, isInstructor, createSection)   //tested
router.post("/updateSection", auth, isInstructor, updateSection)
router.post("/deleteSection", auth, isInstructor, deleteSection)
router.post("/addSubSection", auth, isInstructor, createSubSection)  //tested
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)


//Category routes(can be visited by admin only)
router.post("/createCategory", auth, isAdmin, createNewCategory)  //tested
router.get("/showAllCategories", showAllCategory)   //tested
router.post("/getCategoryPageDetails", categoryPageDetails) 


//Rating and reviews
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", averageRating)
router.get("/getReviews", getAllReviews)

module.exports=router;

