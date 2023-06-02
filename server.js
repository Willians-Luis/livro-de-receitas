const express = require("express")
const usersRouter = require("./routes/users")
const receitasRouter = require("./routes/receitas")
const server = express()

server.use(express.json())

server.use(usersRouter)
server.use(receitasRouter)

module.exports = server