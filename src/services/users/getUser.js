import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getUser = async (id) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        return user;
    } catch (error) {
        console.error(`Error in getUser: ${error.message}`);
        throw error;
    }
};

export default getUser;
