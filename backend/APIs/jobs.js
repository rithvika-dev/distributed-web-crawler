import express from 'express';
import Job from '../models/Job.js';
import { addToQueue } from '../queue/urlQueue.js';
const router=express.Router();

//POST /api/jobs- Start a new crawl job 
router.post('/',async(req,res)=>{
    try{
        const {seedUrl,depth,maxPages}=req.body;

        // create job in MongoDB 
        const job=await Job.create({
            seedUrl,
            depth:depth || 2,
            maxPages:maxPages || 100,
            status:'running'
        });
        // Add seed URL to queue to start crawling 
        await addToQueue(job._id,seedUrl,0);
        res.status(201).json({
            message:'Crawl job started!',job
        });
        
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

// GET /api/jobs - Get all jobs 
router.get('/',async(req,res)=>{
    try{
        // const jobs=(await Job.find()).toSorted([['startedAt',-1]]);
        const jobs=await Job.find();
        res.json(jobs);
    } catch(error){
        res.status(500).json({message:error.message});

    }
    
});

// GET /api/jobs/:id - Get single job 
router.get('/:id',async(req,res)=>{
    try{
        const job = await Job.findById(req.params.id);
        if(!job) return res.status(404).json({message:'Job not found'});
        res.json(job);
    } catch(error) {
        res.status(500).json({message:error.message});
    }
});

// PATCH /api/jobs/:id - Pause a job 
router.patch('/:id/pause',async(req,res)=>{
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            {status:'paused'},
            {new:true}
        );
        res.json({message:'Job paused',job});
    } catch(error) {
        res.status(500).json({message:error.message});
    }
});

// PATCH /api/jobs/:id/stop - stop a job 
router.patch('/:id/stop',async(req,res)=>{
    try{
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            {status:'failed',completedAt:Date.now()},
            {new:true}
        );
        res.json({message:'Job stopped',job});
    } catch(error) {
        res.status(500).json({message:error.message});
    }
});

export default router;