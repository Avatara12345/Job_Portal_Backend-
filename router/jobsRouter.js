const express=require('express');
const { body } = require('express-validator');
const { formValidation } = require('../middleware/jobformValidation');
const { createJob,getAllJobs,deleteJobById,updateJobById,getJobById } = require("../controller/jobController")



const router=express.Router();

 router.post('/createjob',[
 body('title').notEmpty().trim().withMessage("Title is required"),
  body('description').notEmpty().trim().withMessage("Description is required"),
 body('location').notEmpty().trim().withMessage('Location is required'),
  body('company').notEmpty().trim().withMessage("Company name is required"),
  body('salary').notEmpty().isNumeric().withMessage("Salary must be a number")
],formValidation,async(req,res)=>{                       

    return await createJob (req,res)
})

 router.get('/alljobs',async(req,res)=>{    
    return await getAllJobs(req,res)
 })

  router.get('/:jobId',async(req,res)=>{
    return await getJobById(req,res)
  })
 router.delete('/:jobId',async(req,res)=>{
    return await  deleteJobById (req,res)
 })

 router.put('/:jobId',[
 body('title').notEmpty().trim().withMessage("Title is required"),
 body('description').notEmpty().trim().withMessage("Description is required"),
 body('location').notEmpty().trim().withMessage('Location is required'),
 body('company').notEmpty().trim().withMessage("Cpmapany name is required"),
 body('salary').notEmpty().isNumeric().trim().withMessage("Salary is required")
 ],formValidation,async(req,res)=>{
    return await updateJobById(req,res)
 })

module.exports=router
