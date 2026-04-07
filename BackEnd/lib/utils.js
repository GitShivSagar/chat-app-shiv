import jwt from "jsonwebtoken"


//function to create token for a user
//accepting userId from controller by userdata._id name  file where we calling this function 

const generateToken=(userId)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET);
    return token
}

export default generateToken