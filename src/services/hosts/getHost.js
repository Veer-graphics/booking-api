import { PrismaClient } from "@prisma/client";

const getHost = async (id) => {
    const prisma = new PrismaClient();
    const host = await prisma.host.findUnique({
        where: { id },
    });

    return host;
}

export default getHost;