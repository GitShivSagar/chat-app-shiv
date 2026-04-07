import express from "express"
import protectRoute from "../middleware/auth.js"
import MessageController from "../controllers/MessageController.js"

const MessageRouter=express.Router()

MessageRouter.get("/users",protectRoute,MessageController.getUserForSidebar)
MessageRouter.get("/:id",protectRoute,MessageController.getMessage)
MessageRouter.put("mark/:id",protectRoute,MessageController.markMessageAsSeen)
MessageRouter.post("/send/:id",protectRoute,MessageController.sendMessage)


export default MessageRouter