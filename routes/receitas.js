const express = require("express")
const z = require("zod")
const databaseReceitas = require("../database/receitas")
const auth = require("../middleware/auth")
const router = express.Router()

const receitaSchema = z.object({
    nome: z.string().min(2),
    descricao: z.string().max(150),
    tempoPreparo: z.number()
})

router.post("/receitas", auth, async (req, res) => {
    try {
        const receita = receitaSchema.parse(req.body)
        const userId = req.userId
        const savedReceita = await databaseReceitas.setReceita(receita, userId)
        res.status(201).json({ savedReceita })
    } catch (error) {
        if (error instanceof z, z.ZodError) return res.status(422).json({ error: error.erros })
        res.status(500).json({ message: "Server error" })
    }
})

router.put("/receitas/:id", auth, async (req, res) => {
    try {
        const id = Number(req.params.id)
        const user = req.userId
        const receitaExiste = await databaseReceitas.receitaExiste(id)
        if ((!receitaExiste) || (receitaExiste.userId !== user)) 
        return res.status(404).json({ message: "Receita não encontrada" })
        const receita = receitaSchema.parse(req.body)
        const savedReceita = await databaseReceitas.updateReceita(receita, id)
        res.status(201).json({ savedReceita })
    } catch (error) {
        if (error instanceof z, z.ZodError) return res.status(422).json({ error: error.erros })
        res.status(500).json({ message: "Server error" })
    }
})

router.delete("/receitas/:id", auth, async (req, res) => {
    try {
        const id = Number(req.params.id)
        const user = req.userId
        const receitaExiste = await databaseReceitas.receitaExiste(id)
        if ((!receitaExiste) || (receitaExiste.userId !== user)) 
        return res.status(404).json({ message: "Receita não encontrada" })
        await databaseReceitas.deleteReceita(id)
        res.json({ message: "success" })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

router.get("/receitas", auth, async (req, res) => {
    try {
        const userId = req.userId
        const receitas = await databaseReceitas.getReceitas(userId)
        res.status(200).json(receitas)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

module.exports = router
