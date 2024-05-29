const express = require("express")
const router = express.Router()
const { auth, isInstructor } = require("../middlewares/auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
} = require("../controllers/Profile")


router.delete("/deleteProfile", auth, deleteAccount)  //tested
router.put("/updateProfile", auth, updateProfile)   // tested
router.get("/getUserDetails", auth, getAllUserDetails)  //tested

module.exports = router;