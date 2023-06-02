const express = require("express")
const z = require("zod")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const databaseUsers = require("../database/users")
const router = express.Router()

const registerSchema = z.object({
    nome: z.string().min(2),
    email: z.string().email(),
    senha: z.string().min(6)
})

router.post("/register", async (req, res) => {
    try {
        const user = registerSchema.parse(req.body)
        const emailExiste = await databaseUsers.verificarEmail(user.email)
        if (emailExiste) return res.status(400).json({message: "Email já utilizado"})
        user.senha = bcrypt.hashSync(user.senha, 10)
        const savedUser = await databaseUsers.setUser(user)
        delete savedUser.senha
        res.status(201).json({savedUser})
    } catch (error) {
        if (error instanceof z.ZodError) return res.status(422).json({error: error.erros})
        res.status(500).json({message: "Server error"})
    }
})

const loginSchema = z.object({
    email: z.string().email(),
    senha: z.string().min(6)
})

router.post("/login", async (req, res) => {
    try {
        const data = loginSchema.parse(req.body)
        const user = await databaseUsers.verificarEmail(data.email)
        if (!user) return res.status(401).send()
        const compararSenha = bcrypt.compareSync(data.senha, user.senha)
        if (!compararSenha) return res.status(401).send()
        const token = jwt.sign({
            userId: user.id
        }, process.env.SECRET)
        res.status(200).json({token})
    } catch (error) {
        if (error instanceof z.ZodError) return res.status(422).json({error: error.erros})
        res.status(500).json({message: "Server error"})
    }
})

router.get("/users", async (req, res) => {
    try {
        const users = await databaseUsers.getUser()
        delete users.map((user) => {delete user.senha})
        res.status(200).json({users})
    } catch (error) {
        res.status(500).json({message: "Server error"})
    }
})


module.exports = router