const Resume = require("../schema/UserResume");
const Jobs = require("../schema/JobForm")
const path = require('path')
const fs = require("fs")


const applyJob = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'user') {
      return res.status(403).json({ message: 'Only logged-in users can apply' });
    }
    if (!req.body.jobId) {
      return res.status(400).json({ message: 'jobId is required' });
    }
    const job = await Jobs.findById(req.body.jobId);
    if (!job) {
      
      return res.status(404).json({ message: 'Job not found' });
    }
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Resume PDF is required" });
    }

    const newApplication = new Resume({
      user: req.user.id,
      job: job._id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      resume: {
        url: req.file.path,          // Cloudinary public URL
        public_id: req.file.filename // Cloudinary file ID
      },
      coverLetter: req.body.coverLetter,
    });

    const savedApplication = await newApplication.save();

    res.status(201).json({
      message: "Job applied successfully",
      application: savedApplication,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Job application failed!",
      error: err.message,
    });
  }
};


const getMyApplications = async (req, res) => {
  try {
    // Return jobs (from Job schema) that the user has applied to
    const applications = await Resume.find({ user: req.user.id }).select('job').lean();
    const jobIds = applications.map(a => a.job).filter(Boolean);
    const jobs = await Jobs.find({ _id: { $in: jobIds } }).sort({ createdAt: -1 });
    return res.status(200).json(jobs);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch applications' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await Resume.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;

    // Resume upload handled by multer-storage-cloudinary
    if (req.file && req.file.path) {
      user.resume = req.file.path; // Cloudinary URL
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        resume: user.resume,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = { applyJob, getMyApplications, updateProfile };
