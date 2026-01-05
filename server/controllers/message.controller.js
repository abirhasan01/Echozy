const cloudinary = require("../config/cloudinary");
const { getIO, userSoketMap } = require("../config/socket");
const Message = require("../models/message.model");
const User = require("../models/user.model");



// --------- get all user ----------
const getUsersForSideBar = async (req, res) => {
    try {
        
        const userId = req.user._id
        const filteredUsers = await User.find({_id: {$ne: userId}}).select({password: 0})

        // count num of messages not seen
        const unseenMessages = {}
        const promises = filteredUsers.map(async(user) => {
            const messages = await Message.find({senderId: user._id, receiverId: userId, seen: false})
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length
            }
        })
        await Promise.all(promises)
        res.json({
            success: true,
            users: filteredUsers,
            unseenMessages
        })

    } catch (error) {
        console.log(error);
        res.json({
          success: false,
          message: error.message,
        });
    }
}

// --------- get all messages for selected user
const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params
        const myId = req.user._id

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId}
            ]
        })
        await messages.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true})
        res.json({
            success: true,
            messages
        })
        
    } catch (error) {
        console.log(error);
        res.json({
          success: false,
          message: error.message,
        });
    }
}

// api to mark message as seen using message id
const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params
        await Message.findByIdAndUpdate(id, {seen: true})

        res.json({
            success: true
        })
        
    } catch (error) {
        console.log(error);
        res.json({
          success: false,
          message: error.message,
        });
    }
}

// send message to selected user
const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body
        const receiverId = req.params.id
        const senderId = req.user._id

        let imageUrl
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = await Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        newMessage.save()

        // Emit the new message to the receiver's socket
        const io = getIO();
        const receiverSoketId = userSoketMap[receiverId];
        if (receiverSoketId) {
          io.to(receiverSoketId).emit("newMessage", newMessage);
        }

        res.json({
            success: true,
            message: newMessage
        })
        
    } catch (error) {
        console.log(error);
        res.json({
          success: false,
          message: error.message,
        });
    }
}


module.exports = {
    getUsersForSideBar,
    getMessages,
    markMessageAsSeen,
    sendMessage
}