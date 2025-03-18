import { PrismaClient } from "@prisma/client";

const deleteHost = async (id) => {
    const prisma = new PrismaClient();

    try {
        // Verwijder de host met het opgegeven id
        const host = await prisma.host.delete({
            where: { id }
        });

        return host;  // Retourneer de verwijderde host
    } catch (error) {
        // Als de host niet wordt gevonden, gooi een fout
        if (error.code === 'P2025') {
            throw new Error('Host not found');
        }
        throw error;  // Gooi andere fouten door
    }
};

export default deleteHost;
