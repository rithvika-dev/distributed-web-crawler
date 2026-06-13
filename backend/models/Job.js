import mongoose from "mongoose";
const jobSchema=new mongoose.Schema({
    seedUrl:{
        type:String,
        required:true  // The initial URL user provides
    },
    status:{
        type:String,
        enum:['pending','running','paused','completed','failed'],
        default:'pending' // job starts as pending

    },
    depth:{
        type:Number,
        default:2 // How many levels deep to crawl 

    },
    maxPages:{
        type:Number,
        default:100 // stop after crawling 100 pages
    },
    pagesCount:{
        type:Number,
        default:0 // Increases as pages get crawled
    },
    linksCount:{
        type:Number,
        default:0 // Total links discovered 
    },
    startedAt:{
        type:Date,
        default:Date.now 
    },
    completedAt:{
        type:Date // Filled when job finishes
    }
}); 
export default mongoose.model('job',jobSchema);
