import { PrismaClient } from "@prisma/client";

const getHosts = async (filters = {}) => {
    const prisma = new PrismaClient();

    const where = {};

    if (filters.name) {
        where.name = filters.name;
    }


    const hosts = await prisma.host.findMany({ where });

    return hosts;
}

export default getHosts;