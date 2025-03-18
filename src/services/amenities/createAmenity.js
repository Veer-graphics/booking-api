import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createAmenity = async (name) => {
    try {
        // Validate required field
        if (!name) {
            throw new Error("Amenity name is required.");
        }

        // Create the amenity
        const amenity = await prisma.amenity.create({
            data: { name }
        });

        return amenity;
    } catch (error) {
        console.error("Error in createAmenity:", error);
        throw error;
    }
};

export default createAmenity;
