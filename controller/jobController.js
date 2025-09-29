const express = require('express');
const mongoose = require('mongoose');
const jobs = require('../schema/JobForm');

// CREATE job
const createJob = async (req, res) => {
   try {
      const newJob = new jobs({
         title: req.body.title,
         description: req.body.description,
         location: req.body.location,
         company: req.body.company,
         salary: req.body.salary
      });

      const savedJob = await newJob.save();

      return res.status(201).json({
         message: "Job created successfully",
         data: savedJob
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Unable to insert data" });
   }
};

// GET all jobs

const getAllJobs = async (req, res) => {
   try {
      const response = await jobs.find({}).sort({ createdAt: -1 });

      return res.status(200).json(response);
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch jobs" });
   }
};

const getJobById=async(req,res)=>{
   try{
      const { jobId } = req.params;

      if(!mongoose.Types.ObjectId.isValid(jobId)){
         return res.status(400).json({message:"Invalid Job Id"})
      }
      const getJob =await jobs.findById(jobId)
       if(!getJob){
         return res.status(404).json({message:"No job found for this id "})
       }
    return res.status(200).json({Job:getJob})
   }catch(err){
    return res.status(500).json({message:"Server Error ",err:err.message})
   }
}  
// DELETE job by ID
const   deleteJobById = async (req, res) => {
   try {
      const { jobId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(jobId)) {
         return res.status(400).json({ message: "Invalid Job Id!" });
      }
      const deletedJob = await jobs.findByIdAndDelete(jobId);

      if (!deletedJob) {
         return res.status(404).json({ message: "Job not found" });
      }
      return res.status(200).json({
         message: "Job Deleted Successfully",
         deletedJob
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to delete job" });
   }
};

const updateJobById = async (req, res) => {

   try {
      const { jobId } = req.params
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
         return res.status(400).json({ message: "Invalid Job Id !" })
      }
      const updateJob = await jobs.findByIdAndUpdate(jobId, {
         $set: {
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            company: req.body.company,
            salary: req.body.salary
         }
      }, { new: true })
      if (!updateJob) {
         return res.status(404).json({ message: "Job not found" })
      }
      return res.status(200).json({ message: "Job updated successfully", data: updateJob })
   } catch (err) {
      return res.status(500).json({ message: "Server Error", err: err.message })
   }
}

module.exports = {
   createJob,
   getAllJobs,
   deleteJobById,
   updateJobById,
   getJobById
};
