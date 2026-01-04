require("dotenv").config()
const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000
const cors = require("cors")
const http = require("http")
const connectDb = require("./config/db")

// create HTTP server
const server = http.createServer(app)

// ------------ middleware -----------
connectDb()
app.use(cors())
app.use(express.json({limit: "4mb"}))

app.use("/api/status", (req, res) => {
    res.send("Server is Live")
})

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})