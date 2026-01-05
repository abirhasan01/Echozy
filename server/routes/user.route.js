const { signup, login, updateProfile, checkAuth } = require("../controllers/user.controller")
const userAuth = require("../middleware/auth")

const userRouter = require("express").Router()



userRouter.post("/signup", signup)
userRouter.post("/login", login)
userRouter.put("/update-profile", userAuth, updateProfile)
userRouter.get("/check", userAuth, checkAuth)

module.exports = userRouter