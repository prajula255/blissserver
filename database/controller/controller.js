const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()
const { request, response } = require("express")
exports.firstget = async (request, response) => {

    response.send("hii express")

}
