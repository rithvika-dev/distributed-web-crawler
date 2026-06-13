import express from 'express';
import Page from '../models/Page.js';
const router=express.Router();

// GET /api/pages - Get all crawled pages
router.get('/',async(req,res)=>{
    try {
        const pages=await Page.find()
        // .sort({crawledAt:-1})
        .limit(50); // return latest 50 pages
        res.json(pages);
    } catch(error) {
        res.status(500).json({message:error.message});
    }
});

// GET /api/pages/:id - Get pages by job 
router.get('/job/:jobId',async(req,res)=>{
    try {
        const pages= await Page.find({jobId:req.params.jobId})
            .sort({crawledAt:-1});
        res.json(pages);
    } catch(error) {
        res.status(500).json({message:error.message});
    }
});

// GET /api/pages/:id - Get single page 
router.get('/:id',async(req,res)=>{
    try {
        const page = await Page.findById(req.params.id);
        if(!page) return res.status(404).json({message:'page not found'});
        res.json(page);
    } catch(error) {
        res.status(500).json({message:error.message});
    }
});

export default router;