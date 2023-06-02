const prisma = require("./prisma")

const setReceita = (receita, userId) => {
    return prisma.receitas.create({
        data: {
            nome: receita.nome,
            descricao: receita.descricao,
            tempoPreparo: receita.tempoPreparo,
            user: {
                connect: {
                    id: userId
                }
            }
        }
    })
}

const updateReceita = (receita, id) => {
    return prisma.receitas.update({
        where: {
            id: id
        },
        data: receita
    })
}

const deleteReceita = (id) => {
    return prisma.receitas.delete({
        where: {
            id: id
        }
    })
}

const getReceitas = (userId) => {
    return prisma.receitas.findMany({
        where: { userId: userId }
    })
}

const receitaExiste = (id) => {
    return prisma.receitas.findFirst({
        where: { id: id }
    })
}

module.exports = {
    setReceita,
    updateReceita,
    deleteReceita,
    getReceitas,
    receitaExiste
}