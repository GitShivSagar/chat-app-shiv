import express from "express";
import dotenv from "dotenv";
dotenv.config({path:"./config/config.env"});
import cors from "cors";
import http from "http";
import connectDB from "./lib/dbconnect.js";
import userRouter from "./Routes/UserRoutes.js";
import {Server} from "socket.io"
import MessageRouter from "./Routes/Messageroutes.js";


// create express app and http server
const app=express()
const server=http.createServer(app)

// initilaise socket.io server

export const io=new Server(server,{
    cors:{origin:"*"}
})

//store online users
export const userSocketMap={}; //{userId:socketId}

//socket.io connection handler
io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId
    console.log("user connected",userId)

    if(userId) userSocketMap[userId]=socket.id

    //emit online user to all connected cleunts

    io.emit("getOnlineUsers",Object.keys(userSocketMap))

    //kkdmasm
    socket.on("disconnect",()=>{
        console.log("user disconnected",userId)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})

//middleware setup
app.use(express.json({limit:"10mb"}));
app.use(cors())

//Routes Setup
app.use("/api/status",(req,res)=>res.send("server is live"))
app.use("/api/auth",userRouter)
app.use("/api/messages",MessageRouter)
//connect to mongoDB

await connectDB()

const portno=process.env.PORTNO || 5000

server.listen(portno,()=>console.log("Server is running at",portno))