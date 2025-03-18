import { PrismaClient } from "@prisma/client";

const getBookings = async (filters = {}) => {
    const prisma = new PrismaClient();

    const where = {};

    // Filter op userId (exacte match)
    if (filters.userId) {
        where.userId = filters.userId;
    }

    const bookings = await prisma.booking.findMany({ where });

    return bookings;
};

export default getBookings;
