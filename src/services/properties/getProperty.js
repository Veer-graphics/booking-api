import { PrismaClient } from "@prisma/client";

const getProperty = async (id) => {
    const prisma = new PrismaClient();
    const property = await prisma.property.findUnique({
        where: { id },
    });

    return property;
}

export default getProperty;