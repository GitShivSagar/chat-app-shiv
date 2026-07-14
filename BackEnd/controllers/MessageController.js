import cloudinary from "../lib/cloudinary.js"
import MessageModal from "../modals/MessageModal.js"
import UserModal from "../modals/UserModal.js"
import { io, userSocketMap } from "../app.js"


class MessageController {
    static getUserForSidebar = async (req, res) => {
        try {
            const userId = req.userdata._id
            const filteredUsers = await UserModal.find({ _id: { $ne: userId } }).select("-password")

            //count number of message not seen
            const unseenMessages = {}
            const promises = filteredUsers.map(async (user) => {
                const messages = await MessageModal.find({ senderId: user._id, receiverId: userId, seen: false })

                if (messages.length > 0) {
                    unseenMessages[user._id] = messages.length
                }
            })

            await Promise.all(promises)

            res.json({ success: true, userdata: filteredUsers, unseenMessages })


        } catch (error) {
            console.log(error.messages)
            res.json({ success: false, messages: error.messages })
        }
    }

    //get all message for selected user
    static getMessage = async (req, res) => {
        try {
            // we are extracting userid which i clicked to with from req.params when we click on any user then id of that user go as params
            const { id: selectedUserId } = req.params 
            console.log("req.params", req.params)

            const myId = req.userdata._id

            // this code found message of both  "or" check one condition  must be true
            const messages = await MessageModal.find(
                {
                    $or:
                        [
                            { senderId: myId, receiverId: selectedUserId },
                            { senderId: selectedUserId, receiverId: myId },
                        ]
                })

            //to mark message as seen
            await MessageModal.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true })

            res.json({ success: true, messages })

        } catch (error) {
            console.log(error.messages)
            res.josn({ success: false, messages: error.messages })
        }
    }

    //api to mark message as seen using messageid for indivisual message
    static markMessageAsSeen = async (req, res) => {
        try {
            const { id } = req.params
            await MessageModal.findByIdAndUpdate(id, { seen: true })

            res.json({ success: true })
        } catch (error) {
            console.log(error.messages)
            res.josn({ success: false, messages: error.messages })
        }
    }

    //send message to selectes user
    static sendMessage = async (req, res) => {
        try {
            const { text, image } = req.body

            const receiverId = req.params.id
            const senderId = req.userdata._id

            let imageUrl;

            if (image) {
                const uploadResponse = await cloudinary.uploader.upload(image)
                imageUrl = uploadResponse.secure_url
            }

            const newMessage = await MessageModal.create({
                senderId,
                receiverId,
                text,
                image: imageUrl
            })

            //emit the new message to receiver's socket
            const receiverSocketId = userSocketMap(receiverId)
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("new message", newMessage)
            }

            res.json({ success: true, newMessage })
        } catch (error) {
            console.log(error.messages)
            res.json({ success: false, messages: error.messages })
        }
    }
}

export default MessageController