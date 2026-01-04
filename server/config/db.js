const mongoose = require("mongoose")
require("dotenv").config()
const MONGODB_URL = process.env.MONGODB_URL;


const connectDb = async () => {
    await mongoose.connect(MONGODB_URL)
    .then(()=> {
        console.log(`db is connected`)
    })
    .catch((err) => {
        console.log(err)
        console.log(`db is not connected`)
        process.exit(1)
    })
}

module.exports = connectDb