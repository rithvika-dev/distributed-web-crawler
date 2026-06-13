import mongoose from "mongoose";
const linkSchema =new mongoose.Schema({
    jobId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true // Which job this link belong to 
    },
    fromUrl:{
        type:String,
        required:true // The page where this link was found
    },
    toUrl:{
        type: String,
        required:true // The actual link URL discovered
    },
    depth:{
        type:Number,
        default:0 // Depth level of this link
    },
    isCrawled:{
        type:Boolean,
        default:false //Has this link been visited yet?
    },
    discoveredAt:{
        type:Date,
        default:Date.now // when this link was found
    }
});
export default mongoose.model('Link',linkSchema);