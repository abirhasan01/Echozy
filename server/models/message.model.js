const mongoose = require("mongoose")


const messageSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    text: {
        type: String
    },
    image: {
        type: String
    },
    seen: {
        type: Boolean,
        default: false
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }

},)

const Message = mongoose.model("message", messageSchema)

module.exports = Message;