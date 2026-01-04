const generateToken = require("../config/token");
const User = require("../models/user.model")
const bcrypt = require("bcrypt");
const saltRounds = 10;


// ---------------- Signup a new user -----------------
const signup = async (req, res) => {
    const {fullName, email, password, bio} = req.body
    try {

        if(!fullName || !email || !password || !bio){
            return res.json({
                success: false,
                message: "Missing Details"
            })
        }
        const user = await User.findOne({email})
        if(user){
            return res.json({
                success: false,
                message: "Account already exist"
            })
        }
        const hashPassword = await bcrypt.hash(password, saltRounds)

        const userData = {
            fullName, email, password: hashPassword, bio
        }

        const newUser = new User(userData)
        await newUser.save()

        const token = generateToken(newUser._id)

        res.json({
            success: true,
            token,
            userData: newUser,
            message: "Account created successfully"
        })
        
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

// ----------------- login ------------------
const login = async (req, res) => {
    try {
    const { email, password } = req.body;
    const userData = await User.findOne({email})

    if(!userData){
        return res.json({
          success: false,
          message: "User does not exist",
        });
    }

    const hashPassword = await bcrypt.compare(password, userData.password)

    if(!hashPassword) {
        res.json({
            success: false,
            message: "Invalid credentials"
        })
    }
    const token = generateToken(userData._id);

    res.json({
      success: true,
      token,
      userData,
      message: "Login successfull",
    });
        
    } catch (error) {
        console.log(error);
        res.json({
          success: false,
          message: error.message,
        });
    }
}

const checkAuth = (req, res) => {
    res.json({
        success: true,
        user: req.user
    })
}

// -------------- update user profile -----------
const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body

        const userId = req.user._id

        let updatedUser

        
        
    } catch (error) {
        console.log(error);
        res.json({
          success: false,
          message: error.message,
        });
    }
}