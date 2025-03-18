import { PrismaClient } from "@prisma/client";

const deleteProperty = async (id) => {
    const prisma = new PrismaClient();

    try {
        // Verwijder de property met het opgegeven id
        const property = await prisma.property.delete({
            where: { id }
        });

        return property;  // Retourneer de verwijderde property
    } catch (error) {
        // Als de property niet wordt gevonden, gooi een fout
        if (error.code === 'P2025') {
            throw new Error('Property not found');
        }
        throw error;  // Gooi andere fouten door
    }
};

export default deleteProperty;
