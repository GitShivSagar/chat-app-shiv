import express from "express"
import UserController from "../controllers/UserController.js"
import protectRoute from "../middleware/auth.js"

const userRouter=express.Router()

userRouter.post("/signup",UserController.signup)
userRouter.post("/login",UserController.login)
userRouter.put("/updateprofile",protectRoute, UserController.updateProfile)
userRouter.get("/check",protectRoute, UserController.checkAuth)

export default userRouter