const express = require("express");
const { body } = require("express-validator");
const { applyJob, getMyApplications,updateProfile } = require("../controller/resumeController");
const { upload } = require("../config/cloudinary");
const auth = require('../middleware/auth')

const router = express.Router();

router.post(
  "/application",
  auth,
  upload.single("resume"), // 'resume' is the frontend field name
  [
    body("jobId").notEmpty().trim().withMessage("jobId is required"),
    body("name").notEmpty().trim().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").notEmpty().trim().withMessage("Phone number is required"),
    body("coverLetter").notEmpty().trim().withMessage("Cover Letter is required"),
  ],
  (req, res, next) => {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return applyJob(req, res, next);
  }
);

// Protected route to fetch current user's applications
router.get('/my-applications', auth, getMyApplications)

router.put("/updateprofile/:id", auth, upload.single("resume"), updateProfile);

module.exports = router;
