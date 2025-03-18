import { PrismaClient } from "@prisma/client";

const deleteUser = async (id) => {
    const prisma = new PrismaClient();
    try {
        // Probeer de gebruiker te verwijderen
        const user = await prisma.user.delete({
            where: { id },
        });

        return user; // Als de gebruiker gevonden en verwijderd is, wordt de gebruiker geretourneerd
    } catch (error) {
        // Als de gebruiker niet bestaat, geeft Prisma een foutmelding
        return null; // Geen gebruiker gevonden om te verwijderen
    }
};

export default deleteUser;
