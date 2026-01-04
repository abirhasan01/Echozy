require("dotenv").config()
const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

const userAuth = async (req, res, next) => {
    try {
        const token = req.headers.token

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.userId).select({password: 0})

        if(!user){
            return res.json({
                success: false,
                message: "User not found"
            })
        }
        req.user = user
        next()
        
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

module.exports = userAuth