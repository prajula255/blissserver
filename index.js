require("dotenv").config()
const path = require('path')
require("./database/connection/connection")
const express = require("express")
const cors = require("cors")
const router = require("./Router/router")
const server = express()
const port = 3001
server.use(express.json())
server.use(cors())
server.use(router)

server.listen(port, () => {
    console.log(`server is running on port number=${port}`)
})