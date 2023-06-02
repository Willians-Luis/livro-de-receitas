const prisma = require("./prisma")

const verificarEmail = (email) => {
    return prisma.users.findUnique({
        where: {
            email: email
        }
    })
}

const setUser = (user) => {
    return prisma.users.create({
        data: user
    })
}

const getUser = () => {
    return prisma.users.findMany()
}

module.exports = {
    verificarEmail,
    setUser,
    getUser
}

