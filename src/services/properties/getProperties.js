import { PrismaClient } from "@prisma/client";

const getProperties = async (filters = {}) => {
    const prisma = new PrismaClient();

    const where = {};

    // Filteren op locatie (exacte match)
    if (filters.location) {
        where.location = filters.location;
    }

    // Filteren op prijs (bijvoorbeeld per nacht, met `lte` of `gte`)
    if (filters.pricePerNight) {
        where.pricePerNight = {
            lte: parseFloat(filters.pricePerNight), // of 'gte' afhankelijk van wens
        };
    }

    const properties = await prisma.property.findMany({ where });

    return properties;
};

export default getProperties;
