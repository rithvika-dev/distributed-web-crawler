import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import {createServer} from 'http';
import { Server } from "socket.io";
import { startWorker } from "./queue/urlQueue.js";
import JobRoutes from './APIs/jobs.js';
import pageRoutes from './APIs/pages.js';
import statsRoutes from './APIs/stats.js';

// load environment variables from .env file
dotenv.config();
const app=express();
const PORT=process.env.PORT || 5000;

// create HTTP server and Socket.io
const httpServer = createServer(app);
export const io=new Server(httpServer, {
    cors: {origin: ' https://distributed-web-crawler-nchn.onrender.com',credentials: true}
});

// Socket.io Connection 
io.on('connection',(socket)=>{
    console.log(`Client connected: ${socket.id}`);

    socket.on('disconnect',()=>{
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/jobs',JobRoutes);
app.use('/api/pages',pageRoutes);
app.use('/api/stats',statsRoutes);


// connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("connected to MongoDB");
    startWorker(); // Start the crawler workers after connecting to MongoDB
})

.catch((err)=>{
    console.error('MongoDB Error:',err.message);
    process.exit(1);
})


// test route
app.get("/",(req,res)=>{
    res.json({message:"Web crawler API is running"});

})

// start server
httpServer.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})