import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const createBooking = async (checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus, userId, propertyId) => {
    try {
        // Validate required fields
        if (!checkinDate || !checkoutDate || !numberOfGuests || !totalPrice || !bookingStatus || !userId || !propertyId) {
            throw new Error("All fields are required.");
        }

        // Check if the user exists
        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) {
            throw new Error("User not found.");
        }

        // Check if the property exists
        const propertyExists = await prisma.property.findUnique({ where: { id: propertyId } });
        if (!propertyExists) {
            throw new Error("Property not found.");
        }

        // Create new booking
        const newBooking = await prisma.booking.create({
            data: {
                checkinDate,
                checkoutDate,
                numberOfGuests,
                totalPrice,
                bookingStatus,
                user: { connect: { id: userId } },
                property: { connect: { id: propertyId } }
            }
        });

        return newBooking;
    } catch (error) {
        console.error("Error in createBooking:", error);
        throw error;
    }
};

export default createBooking;
