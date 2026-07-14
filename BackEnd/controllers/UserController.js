import UserModal from "../modals/UserModal.js"
import bcrypt from "bcryptjs"
import generateToken from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

class UserController {
    // signup new user

    static signup = async (req, res) => {
        const { email, fullName, password, bio } = req.body
        console.log("User data from req.body", req.body)

        try {
            if (!fullName || !email || !password || !bio) {
                return res.json({
                    success: false,
                    msg: "Missing Details"
                })
            }

            const user = await UserModal.findOne({ email })
            console.log("user is exist", user)

            if (user) {
                return res.json({
                    success: false,
                    msg: "Account already existed"
                })
            }

            //encrypt password
            const salt = await bcrypt.genSalt(10);
            const hashedpassword = await bcrypt.hash(password, salt);


            //create a new user in mongodb
            const newuser = await UserModal.create({
                fullName, email, password: hashedpassword, bio
            });

            //create token
            const token = generateToken(newuser._id)

            res.json({
                success: true,
                record: newuser,
                token: token,
                msg: "Account created successfully"
            })
        } catch (error) {
            console.log(error.message)
            res.json({
                success: false,
                msg: "Something went wrong. Please try again."
            })
        }
    }

    static login = async (req, res) => {
        const { email, password } = req.body

        try {
            const userdata = await UserModal.findOne({ email })

            if (!userdata) {
                return res.json({ success: false, msg: "Invalid email or password" })
            }

            const ispasswordCorrect = await bcrypt.compare(password, userdata.password)

            if (!ispasswordCorrect) {
                return res.json({ success: false, msg: "Invalid email or password" })
            }

            const token = generateToken(userdata._id)
            res.json({ success: true, userdata, token, msg: "Login Successfully" })

        } catch (error) {
            console.log(error.message)
            res.json({ success: false, msg: "Something went wrong. Please try again." })
        }
    }

    //check if user is authenticated
    static checkAuth = async (req, res) => {
        res.json({ success: true, userdata: req.userdata })
    }

    // controller to upadte user profile details
    static updateProfile = async (req, res) => {
        try {
            const { profilePic, bio, fullName } = req.body
            console.log("users profile pic", req.body)

            //extract userId from middleware 
            const userId = req.userdata._id
            let updatedUser

            if (!profilePic) {
                updatedUser = await UserModal.findByIdAndUpdate(userId, { bio, fullName }, { new: true })
            }
            else {
                //to upload profile pic on cloudinary
                const uploadProfilePic = await cloudinary.uploader.upload(profilePic)
                updatedUser = await UserModal.findByIdAndUpdate(userId, { profilePic: uploadProfilePic.secure_url, bio, fullName }, { new: true })
            }

            res.json({ success: true, userdata: updatedUser })
        } catch (error) {
            console.log(error.message)
            res.json({ success: false, message: "Something went wrong. Please try again." })
        }
    }
}

export default UserController