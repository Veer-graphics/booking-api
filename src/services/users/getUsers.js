import { PrismaClient } from "@prisma/client";

const getUsers = async (filters = {}) => {
    const prisma = new PrismaClient();
    const where = {};

    if (filters.username) {
        where.username = filters.username;
    }

    const users = await prisma.user.findMany({ where });

    return users;
}

export default getUsers;