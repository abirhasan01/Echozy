const { getUsersForSideBar, getMessages, markMessageAsSeen, sendMessage } = require("../controllers/message.controller")
const userAuth = require("../middleware/auth")

const messageRouter = require("express").Router()


messageRouter.get("/user", userAuth, getUsersForSideBar)
messageRouter.get("/:id", userAuth, getMessages)
messageRouter.put("/mark/:id", userAuth, markMessageAsSeen)
messageRouter.post("/send/:id", userAuth, sendMessage)

module.exports = messageRouter