import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createProperty = async (title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, rating, hostId) => {
    try {
        // Validate required fields
        if (!title || !description || !location || !pricePerNight || !hostId) {
            throw new Error("Title, description, location, pricePerNight, and hostId are required.");
        }

        // Check if host exists
        const host = await prisma.host.findUnique({ where: { id: hostId } });
        if (!host) {
            throw new Error("Host with the given ID does not exist.");
        }

        // Create property
        const property = await prisma.property.create({
            data: { title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, rating, hostId }
        });

        return property;
    } catch (error) {
        console.error("Error in createProperty:", error);
        throw error;
    }
};

export default createProperty;
