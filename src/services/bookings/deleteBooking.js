import { PrismaClient } from "@prisma/client";

const deleteBooking = async (id) => {
    const prisma = new PrismaClient();

    try {
        // Verwijder de booking met het opgegeven ID
        const booking = await prisma.booking.delete({
            where: { id }
        });

        return booking;  // Retourneer de verwijderde booking
    } catch (error) {
        // Als booking niet gevonden wordt, gooi een fout
        if (error.code === 'P2025') {
            throw new Error('Booking not found');
        }
        throw error;  // Gooi andere fouten door
    }
};

export default deleteBooking;
