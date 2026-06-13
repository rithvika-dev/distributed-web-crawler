import mongoose from "mongoose";
const pageSchema=new mongoose.Schema({
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'job',
        required:true // which job crawled this page
    },
    url:{
        type:String,
        required:true // The page URL
    },
    title:{
        type:String,
        default:'' // page title from <title> tag
    },
    description:{
        type:String,
        default:'' // Meta description tag 
    },
    content:{
        type:String,
        default:'' // Main text content of the page 
    },
    statusCode:{
        type:Number, // HTTP response code(200,404,500.....)
    },
    depth:{
        type:Number,
        default:0     //how deep this page is from seedUrl
    },
    linksFound:{
        type:Number,
        default:0    // how many links were on the page 
    },
    crawledAt:{
        type:Date,
        default:Date.now // when this page was crawled
    }

});
export default mongoose.model('page',pageSchema);