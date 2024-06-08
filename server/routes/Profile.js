const express = require("express")
const router = express.Router()
const { auth, isInstructor } = require("../middlewares/auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  getEnrolledCourses,
  updateDisplayPicture,
} = require("../controllers/Profile")


router.put("/updateDisplayPicture",auth,updateDisplayPicture)
router.delete("/deleteProfile", auth, deleteAccount)  //tested
router.put("/updateProfile", auth, updateProfile)   // tested
router.get("/getUserDetails", auth, getAllUserDetails)  //tested

router.get("/getEnrolledCourses", auth, getEnrolledCourses)


module.exports = router;