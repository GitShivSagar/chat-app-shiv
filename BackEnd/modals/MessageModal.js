import mongoose from "mongoose";
import UserModal from "./UserModal.js";

const MessageSchema = new mongoose.Schema({

   senderId:{type:mongoose.Schema.Types.ObjectId,ref:"UserModal",required:true},
   receiverId:{type:mongoose.Schema.Types.ObjectId,ref:"UserModal",required:true},
   text:{type:String},
   image:{type:String},
   seen:{type:Boolean,default:false},
}, { timestamps: true })

const MessageModal = mongoose.model("Message", MessageSchema)

export default MessageModal