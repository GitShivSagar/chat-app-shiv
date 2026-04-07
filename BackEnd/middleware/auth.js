import UserModal from "../modals/UserModal.js";
import jwt from "jsonwebtoken"

//middleware to protect routes
const protectRoute=async(req,res,next)=>{
    try {
        const token=req.headers.token;

        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        
        const userdata=await UserModal.findById(decoded.userId).select("-password")

        if(!userdata){
           return res.json({success:false,msg:"user not found"})
        }

        // this will add userdata in request userdata if userdata found above
        req.userdata = userdata;
        next()
    } catch (error) {
        console.log(error.message)
        res.json({success:false,msg:error.message})
    }
}

export default protectRoute