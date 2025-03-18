import { PrismaClient } from "@prisma/client";

const deleteAmenity = async (id) => {
    const prisma = new PrismaClient();
    try {
        // Verwijder de specifieke amenity op basis van het id
        const amenity = await prisma.amenity.delete({
            where: { id }
        });

        return amenity;  // Retourneer de verwijderde amenity
    } catch (error) {
        // Als de amenity niet wordt gevonden, gooi een fout
        if (error.code === 'P2025') {
            throw new Error('Amenity not found');
        }
        throw error;  // Gooi andere fouten door
    }
};

export default deleteAmenity;
