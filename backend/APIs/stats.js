import express from 'express';
import Job from '../models/Job.js';
import Page from '../models/Page.js';
import Link from '../models/Link.js';
const router = express.Router();

// GET /api/stats - Get overall stats
router.get('/',async(req,res)=>{
    try {
        const totalJobs= await Job.countDocuments();
        const totalPages=await Page.countDocuments();
        const totalLinks=await Link.countDocuments();

        const runningJobs=await Job.countDocuments({status:'running'});
        const completedJobs=await Job.countDocuments({status:'completed'});
        const failedJobs=await Job.countDocuments({status:'failed'});
        res.json({
            totalJobs,
            totalPages,
            totalLinks,
            runningJobs,
            completedJobs,
            failedJobs
        });

    } catch(error) {
        res.status(500).json({message:error.message});
    }
});

// GET /api/stats/job/:id - Get stats for one job 
router.get('/job/:id',async(req,res)=>{
    try {
        const job = await Job.findById(req.params.id);
        if(!job) return res.status(404).json({message:'Job not found'});

        const pagesCount=await Page.countDocuments({jobId: req.params.jobId});
        const linksCount=await Link.countDocuments({jobId: req.params.jobId});
        const crawledLinks=await Link.countDocuments({
            jobId: req.params.jobId,
            isCrawled:true
        });
        const pendingLinks=await Link.countDocuments({
            jobId: req.params.jobId,
            isCrawled:false
        });
        res.json({
            job,
            pagesCount,
            linksCount,
            crawledLinks,
            pendingLinks
        });
    } catch(error) {
        res.status(500).json({message:error.message});
    }
});
export default router;
