import { PrismaClient } from "@prisma/client";

const getBooking = async (id) => {
    const prisma = new PrismaClient();
    const booking = await prisma.booking.findUnique({
        where: { id },
    });

    return booking;
}

export default getBooking;